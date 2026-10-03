/**
 * Risk-driven PDCA spiral supervisor for Pi.
 *
 * Policy layer only. It does not add a new core primitive.
 *
 * observe -> assess -> select bounded work -> plan -> do -> check -> act
 * -> standardize -> reassess -> next spiral
 *
 * State is persisted as custom session entries, so it follows the active
 * conversation branch and reconstructs correctly after tree navigation/forks.
 *
 * Optional Jev integration:
 * - if typesafe/jev-latest is available, `jev_triage` asks Jev to classify
 *   undecided risks in one structured classifier call;
 * - recommendations carry probability/confidence;
 * - auto-apply is opt-in and confidence-gated;
 * - deterministic policy remains the source of truth for evidence and budgets.
 */

import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext, ToolExecutionMode } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

type Phase = "observe" | "assess" | "plan" | "do" | "check" | "act" | "standardize" | "reassess";
type RiskDisposition = "do_now" | "this_cycle" | "next_cycle" | "backlog" | "accept";
type RiskStatus = "open" | "treated" | "accepted" | "deferred";
type EvidenceKind = "test" | "command" | "metric" | "log" | "diff" | "document" | "human" | "other";

interface ResourceEnvelope {
	timeMinutes?: number;
	humanMinutes?: number;
	budgetUsd?: number;
	maxTasks?: number;
	compute?: "low" | "medium" | "high";
	notes?: string;
}

interface JevRecommendation {
	disposition: RiskDisposition;
	confidence?: number;
	probabilities?: Partial<Record<RiskDisposition, number>>;
	cycle: number;
}

interface RiskItem {
	id: number;
	title: string;
	description?: string;
	impact: number;
	likelihood: number;
	urgency: number;
	effort: number;
	riskScore: number;
	priorityDensity: number;
	disposition?: RiskDisposition;
	status: RiskStatus;
	rationale?: string;
	jev?: JevRecommendation;
	createdCycle: number;
	updatedCycle: number;
}

interface EvidenceItem {
	id: number;
	kind: EvidenceKind;
	summary: string;
	reference?: string;
	supports?: string;
	cycle: number;
}

interface Baseline {
	cycle: number;
	summary: string;
	evidenceIds: number[];
	promotedAt: string;
}

interface SpiralState {
	enabled: boolean;
	cycle: number;
	phase: Phase;
	objective?: string;
	resources: ResourceEnvelope;
	risks: RiskItem[];
	evidence: EvidenceItem[];
	baselines: Baseline[];
	nextRiskId: number;
	nextEvidenceId: number;
	updatedAt: string;
}

interface PersistedState {
	version: 1;
	state: SpiralState;
}

const STATE_TYPE = "risk-pdca-state";

function initialState(): SpiralState {
	return {
		enabled: true,
		cycle: 1,
		phase: "observe",
		resources: {},
		risks: [],
		evidence: [],
		baselines: [],
		nextRiskId: 1,
		nextEvidenceId: 1,
		updatedAt: new Date(0).toISOString(),
	};
}

function cloneState(state: SpiralState): SpiralState {
	return structuredClone(state);
}

function touch(state: SpiralState): void {
	state.updatedAt = new Date().toISOString();
}

function clampRating(value: number): number {
	return Math.max(1, Math.min(5, Math.round(value)));
}

function clampConfidence(value: number | undefined): number | undefined {
	if (value === undefined || !Number.isFinite(value)) return undefined;
	return Math.max(0, Math.min(1, value));
}

function riskScore(impact: number, likelihood: number): number {
	return impact * likelihood;
}

function priorityDensity(impact: number, likelihood: number, urgency: number, effort: number): number {
	const score = riskScore(impact, likelihood);
	return Math.round(((score * urgency) / Math.max(1, effort)) * 100) / 100;
}

function formatRisk(risk: RiskItem): string {
	const decision = risk.disposition ? ` -> ${risk.disposition}` : "";
	const confidence =
		risk.jev?.confidence === undefined ? "" : `@${risk.jev.confidence.toFixed(2)}`;
	const recommendation = risk.jev ? ` [jev=${risk.jev.disposition}${confidence}]` : "";
	return `R${risk.id} [risk=${risk.riskScore}, density=${risk.priorityDensity}] ${risk.title}${decision}${recommendation}`;
}

function selectedThisCycle(state: SpiralState): RiskItem[] {
	return state.risks.filter(
		(risk) =>
			risk.status === "open" &&
			(risk.disposition === "do_now" || risk.disposition === "this_cycle"),
	);
}

function formatState(state: SpiralState): string {
	const selected = selectedThisCycle(state);
	const undecided = state.risks.filter((risk) => risk.status === "open" && !risk.disposition);
	const deferred = state.risks.filter(
		(risk) =>
			risk.status === "deferred" ||
			risk.disposition === "next_cycle" ||
			risk.disposition === "backlog",
	);
	const accepted = state.risks.filter(
		(risk) => risk.status === "accepted" || risk.disposition === "accept",
	);
	const latestBaseline = state.baselines.at(-1);

	return [
		`PDCA spiral: ${state.enabled ? "enabled" : "disabled"}`,
		`cycle=${state.cycle} phase=${state.phase}`,
		`objective=${state.objective ?? "(unset)"}`,
		`resources=${JSON.stringify(state.resources)}`,
		`selected=${selected.length}${selected.length ? `\n  ${selected.map(formatRisk).join("\n  ")}` : ""}`,
		`undecided=${undecided.length}${undecided.length ? `\n  ${undecided.map(formatRisk).join("\n  ")}` : ""}`,
		`deferred=${deferred.length}`,
		`accepted=${accepted.length}`,
		`evidence=${state.evidence.length}`,
		`baseline=${latestBaseline ? `cycle ${latestBaseline.cycle}: ${latestBaseline.summary}` : "(none)"}`,
	].join("\n");
}

function policyText(state: SpiralState): string {
	const selected = selectedThisCycle(state);
	const openRisks = state.risks.filter((risk) => risk.status === "open");
	const latestBaseline = state.baselines.at(-1);

	return [
		"## Risk-driven PDCA spiral",
		"",
		"This session has a lightweight PDCA spiral supervisor. Treat it as governance, not as a replacement for the user's objective.",
		"",
		"Current control state:",
		`- cycle: ${state.cycle}`,
		`- phase: ${state.phase}`,
		`- objective: ${state.objective ?? "not set yet"}`,
		`- resource envelope: ${JSON.stringify(state.resources)}`,
		`- latest baseline: ${latestBaseline?.summary ?? "none"}`,
		`- open risks: ${openRisks.length}`,
		`- selected for this cycle: ${selected.length}`,
		"",
		"Rules:",
		"1. For material multi-step work, keep the objective explicit and observe current state before changing it.",
		"2. Record material uncertainty, failure modes, blockers, unsafe side effects, or missing capability as risks with `risk_pdca`.",
		"3. Resources are bounded. Finding a problem does not automatically authorize work on it.",
		"4. Risk scores and priority density are heuristics only. Also consider dependencies, reversibility, user intent, and consequences of delay.",
		"5. Classify work as `do_now`, `this_cycle`, `next_cycle`, `backlog`, or `accept`. Only `do_now` and `this_cycle` belong in the active plan.",
		"6. A CHECK must cite objective evidence: tests, command output, metrics, logs, diffs, documents, or explicit human acceptance. \"Looks good\" is not evidence.",
		"7. A failed CHECK does not automatically mean fix now. Record/reassess the residual risk and defer it when acceptable inside the current resource envelope.",
		"8. Resolve a treated risk only with recorded evidence.",
		"9. Promote a new baseline only after evidence supports it. Standardization can be code, config, tests, runbooks, docs, or another durable known-good state.",
		"10. At the end of a cycle, reassess residual risks and carry deferred work into the next spiral.",
		"11. Jev recommendations are decision support, not proof. Low-confidence recommendations stay undecided.",
		"12. Do not create busywork merely to advance PDCA phases. Trivial requests may skip the spiral.",
		"",
		"Selected risks for this cycle:",
		selected.length ? selected.map((risk) => `- ${formatRisk(risk)}`).join("\n") : "- none",
	].join("\n");
}

function reconstructState(ctx: ExtensionContext): SpiralState {
	let state = initialState();
	for (const entry of ctx.sessionManager.getBranch()) {
		if (entry.type !== "custom" || entry.customType !== STATE_TYPE) continue;
		const persisted = entry.data as PersistedState | undefined;
		if (persisted?.version === 1 && persisted.state) state = cloneState(persisted.state);
	}
	return state;
}

function applyDisposition(state: SpiralState, risk: RiskItem, disposition: RiskDisposition, rationale?: string): void {
	if (disposition === "this_cycle" && state.resources.maxTasks !== undefined) {
		const alreadySelected = selectedThisCycle(state).filter((item) => item.id !== risk.id).length;
		if (alreadySelected >= state.resources.maxTasks) {
			throw new Error(
				`resource envelope maxTasks=${state.resources.maxTasks} is full; defer this risk or change the envelope`,
			);
		}
	}

	risk.disposition = disposition;
	risk.rationale = rationale?.trim();
	risk.updatedCycle = state.cycle;

	if (disposition === "accept") risk.status = "accepted";
	else if (disposition === "next_cycle" || disposition === "backlog") risk.status = "deferred";
	else risk.status = "open";
}

export default function riskPdcaExtension(pi: ExtensionAPI) {
	let state = initialState();

	const persist = (): void => {
		touch(state);
		pi.appendEntry<PersistedState>(STATE_TYPE, { version: 1, state: cloneState(state) });
	};

	const reload = (ctx: ExtensionContext): void => {
		state = reconstructState(ctx);
	};

	pi.on("session_start", async (_event, ctx) => reload(ctx));
	pi.on("session_tree", async (_event, ctx) => reload(ctx));

	pi.on("before_agent_start", async (event) => {
		if (!state.enabled) return undefined;
		return { systemPrompt: event.systemPrompt + policyText(state) };
	});

	const Action = StringEnum(
		[
			"status",
			"enable",
			"disable",
			"set_objective",
			"set_resources",
			"record_risk",
			"decide_risk",
			"jev_triage",
			"record_evidence",
			"resolve_risk",
			"set_phase",
			"promote_baseline",
			"next_cycle",
		] as const,
	);

	pi.registerTool({
		name: "risk_pdca",
		label: "Risk PDCA",
		description:
			"Manage a risk-driven PDCA spiral: objective, resource envelope, risk register, optional Jev triage, evidence, phase, treated risks, baseline, and next-cycle carryover.",
		promptSnippet: "Govern bounded work with a risk-driven PDCA spiral",
		promptGuidelines: [
			"Record material risks instead of silently expanding scope.",
			"Only do_now and this_cycle risks belong in the current plan.",
			"Jev triage is fast decision support; evidence and deterministic policy remain authoritative.",
			"Record objective evidence before resolving a risk or promoting a baseline.",
			"Use next_cycle to carry residual risks forward instead of trying to perfect everything now.",
		],
		executionMode: "sequential" as ToolExecutionMode,
		parameters: Type.Object({
			action: Action,
			objective: Type.Optional(Type.String()),
			timeMinutes: Type.Optional(Type.Number({ minimum: 1 })),
			humanMinutes: Type.Optional(Type.Number({ minimum: 0 })),
			budgetUsd: Type.Optional(Type.Number({ minimum: 0 })),
			maxTasks: Type.Optional(Type.Number({ minimum: 1 })),
			compute: Type.Optional(StringEnum(["low", "medium", "high"] as const)),
			notes: Type.Optional(Type.String()),
			riskId: Type.Optional(Type.Number({ minimum: 1 })),
			title: Type.Optional(Type.String()),
			description: Type.Optional(Type.String()),
			impact: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
			likelihood: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
			urgency: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
			effort: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
			disposition: Type.Optional(
				StringEnum(["do_now", "this_cycle", "next_cycle", "backlog", "accept"] as const),
			),
			rationale: Type.Optional(Type.String()),
			autoApply: Type.Optional(Type.Boolean()),
			minConfidence: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
			evidenceKind: Type.Optional(
				StringEnum(["test", "command", "metric", "log", "diff", "document", "human", "other"] as const),
			),
			summary: Type.Optional(Type.String()),
			reference: Type.Optional(Type.String()),
			supports: Type.Optional(Type.String()),
			phase: Type.Optional(
				StringEnum(["observe", "assess", "plan", "do", "check", "act", "standardize", "reassess"] as const),
			),
			evidenceIds: Type.Optional(Type.Array(Type.Number({ minimum: 1 }))),
		}),

		async execute(_toolCallId, params, signal, _onUpdate, ctx) {
			switch (params.action) {
				case "status":
					break;

				case "enable":
					state.enabled = true;
					persist();
					break;

				case "disable":
					state.enabled = false;
					persist();
					break;

				case "set_objective":
					if (!params.objective?.trim()) throw new Error("objective is required");
					state.objective = params.objective.trim();
					persist();
					break;

				case "set_resources":
					state.resources = {
						timeMinutes: params.timeMinutes,
						humanMinutes: params.humanMinutes,
						budgetUsd: params.budgetUsd,
						maxTasks: params.maxTasks,
						compute: params.compute,
						notes: params.notes,
					};
					persist();
					break;

				case "record_risk": {
					if (!params.title?.trim()) throw new Error("title is required");
					if (
						params.impact === undefined ||
						params.likelihood === undefined ||
						params.urgency === undefined ||
						params.effort === undefined
					) {
						throw new Error("impact, likelihood, urgency, and effort are required");
					}

					const impact = clampRating(params.impact);
					const likelihood = clampRating(params.likelihood);
					const urgency = clampRating(params.urgency);
					const effort = clampRating(params.effort);

					state.risks.push({
						id: state.nextRiskId++,
						title: params.title.trim(),
						description: params.description?.trim(),
						impact,
						likelihood,
						urgency,
						effort,
						riskScore: riskScore(impact, likelihood),
						priorityDensity: priorityDensity(impact, likelihood, urgency, effort),
						status: "open",
						createdCycle: state.cycle,
						updatedCycle: state.cycle,
					});
					persist();
					break;
				}

				case "decide_risk": {
					if (params.riskId === undefined || !params.disposition) {
						throw new Error("riskId and disposition are required");
					}
					const risk = state.risks.find((item) => item.id === params.riskId);
					if (!risk) throw new Error(`risk R${params.riskId} not found`);
					applyDisposition(state, risk, params.disposition, params.rationale);
					persist();
					break;
				}

				case "jev_triage": {
					const candidates = state.risks.filter((risk) => risk.status === "open" && !risk.disposition);
					if (candidates.length === 0) break;

					const jev = ctx.modelRegistry.findOfType("classifier", "typesafe", "jev-latest");
					if (!jev) {
						throw new Error(
							"typesafe/jev-latest classifier is unavailable; configure TypeSafe credentials or decide risks manually",
						);
					}

					const questions: Record<string, any> = {};
					for (const risk of candidates) {
						questions[`r${risk.id}`] = {
							type: "choice",
							instructions:
								"Choose the most justified disposition for this risk under the stated objective and resource envelope. Prefer deferral over scope expansion when residual risk is tolerable.",
							criteria: {
								do_now:
									"Immediate action is justified because delay creates unacceptable safety, security, data, production, irreversible, or blocking risk.",
								this_cycle:
									"Material risk should be treated in the current bounded cycle and fits the available resources.",
								next_cycle:
									"Meaningful risk, but residual risk is tolerable until the next spiral or current resources are better spent elsewhere.",
								backlog:
									"Low urgency/value relative to current objective; keep visible but do not schedule next.",
								accept:
									"Residual risk is explicitly reasonable relative to treatment cost/complexity; no treatment is currently justified.",
							},
						};
					}

					const result = await ctx.modelRegistry.classify(
						jev,
						{
							state: {
								objective: state.objective ?? null,
								resources: state.resources,
								cycle: state.cycle,
								risks: candidates.map((risk) => ({
									id: risk.id,
									title: risk.title,
									description: risk.description,
									impact: risk.impact,
									likelihood: risk.likelihood,
									urgency: risk.urgency,
									effort: risk.effort,
									riskScore: risk.riskScore,
									priorityDensity: risk.priorityDensity,
								})),
							} as any,
							questions,
						},
						{ signal },
					);

					if (result.stopReason !== "stop") throw new Error(`Jev triage stopped: ${result.stopReason}`);

					const answers = result.answers as Record<string, any>;
					const minConfidence = params.minConfidence ?? 0.8;
					for (const risk of candidates) {
						const answer = answers[`r${risk.id}`];
						if (answer?.type !== "choice") continue;
						const disposition = answer.choice as RiskDisposition;
						if (!["do_now", "this_cycle", "next_cycle", "backlog", "accept"].includes(disposition)) continue;
						const confidence = clampConfidence(answer.confidence);
						risk.jev = {
							disposition,
							confidence,
							probabilities: answer.probabilities,
							cycle: state.cycle,
						};
						risk.updatedCycle = state.cycle;

						if (params.autoApply && (confidence ?? 0) >= minConfidence) {
							try {
								applyDisposition(
									state,
									risk,
									disposition,
									`Jev auto-apply at confidence ${confidence?.toFixed(2) ?? "unknown"}`,
								);
							} catch {
								// Keep the recommendation but do not override deterministic resource policy.
							}
						}
					}
					persist();
					break;
				}

				case "record_evidence":
					if (!params.evidenceKind || !params.summary?.trim()) {
						throw new Error("evidenceKind and summary are required");
					}
					state.evidence.push({
						id: state.nextEvidenceId++,
						kind: params.evidenceKind,
						summary: params.summary.trim(),
						reference: params.reference?.trim(),
						supports: params.supports?.trim(),
						cycle: state.cycle,
					});
					persist();
					break;

				case "resolve_risk": {
					if (params.riskId === undefined) throw new Error("riskId is required");
					const ids = params.evidenceIds ?? [];
					if (ids.length === 0) throw new Error("at least one evidenceId is required to resolve a risk");
					const known = new Set(state.evidence.map((item) => item.id));
					const missing = ids.filter((id) => !known.has(id));
					if (missing.length) throw new Error(`unknown evidence id(s): ${missing.join(", ")}`);
					const risk = state.risks.find((item) => item.id === params.riskId);
					if (!risk) throw new Error(`risk R${params.riskId} not found`);
					risk.status = "treated";
					risk.updatedCycle = state.cycle;
					risk.rationale = params.rationale?.trim() ?? risk.rationale;
					persist();
					break;
				}

				case "set_phase":
					if (!params.phase) throw new Error("phase is required");
					state.phase = params.phase;
					persist();
					break;

				case "promote_baseline": {
					if (!params.summary?.trim()) throw new Error("summary is required");
					const ids = params.evidenceIds ?? [];
					if (ids.length === 0) throw new Error("at least one evidenceId is required");
					const known = new Set(state.evidence.map((item) => item.id));
					const missing = ids.filter((id) => !known.has(id));
					if (missing.length) throw new Error(`unknown evidence id(s): ${missing.join(", ")}`);
					state.baselines.push({
						cycle: state.cycle,
						summary: params.summary.trim(),
						evidenceIds: [...ids],
						promotedAt: new Date().toISOString(),
					});
					state.phase = "reassess";
					persist();
					break;
				}

				case "next_cycle":
					state.cycle += 1;
					state.phase = "observe";
					for (const risk of state.risks) {
						if (risk.status === "deferred" && risk.disposition === "next_cycle") {
							risk.status = "open";
							risk.disposition = undefined;
							risk.rationale = undefined;
							risk.jev = undefined;
							risk.updatedCycle = state.cycle;
						}
					}
					persist();
					break;
			}

			return {
				content: [{ type: "text", text: formatState(state) }],
				details: { state: cloneState(state) },
			};
		},
	});

	pi.registerCommand("pdca", {
		description: "Show the current risk-driven PDCA spiral state",
		handler: async (_args, ctx) => {
			ctx.ui.notify(formatState(state), "info");
		},
	});
}
