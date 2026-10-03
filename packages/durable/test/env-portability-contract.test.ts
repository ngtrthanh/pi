import { posix } from "node:path";
import type { Context, JsonValue } from "@earendil-works/chord";
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import type { ToolExecutionApi, ToolRegistration } from "@earendil-works/pi-durable";
import { describe, expect, it } from "vitest";
import {
	type ExecutionEnv,
	ExecutionError,
	FileError,
	type FileInfo,
	ok,
	type Result,
	type ShellExecOptions,
	type ShellExecResult,
	type TextLineReader,
} from "../src/env/index.ts";
import { createReadTool, createWriteTool } from "../src/tools/index.ts";

class MemoryExecutionEnv implements ExecutionEnv {
	readonly id = "memory:test";
	cwd = "/workspace";
	private readonly files = new Map<string, Uint8Array>();

	private path(path: string): string {
		return posix.isAbsolute(path) ? posix.normalize(path) : posix.resolve(this.cwd, path);
	}

	async absolutePath(path: string, _context: Context) {
		return ok<string, FileError>(this.path(path));
	}
	async joinPath(parts: string[], _context: Context) {
		return ok<string, FileError>(posix.join(...parts));
	}
	async readTextFile(path: string, _context: Context) {
		const value = this.files.get(this.path(path));
		return value
			? ok<string, FileError>(new TextDecoder().decode(value))
			: ({ ok: false, error: new FileError("not_found", "not found", this.path(path)) } as const);
	}
	async openTextLineReader(_path: string, _context: Context): Promise<Result<TextLineReader, FileError>> {
		throw new Error("not needed by portability test");
	}
	async readTextLines(path: string, options: { maxLines?: number } | undefined, context: Context) {
		const result = await this.readTextFile(path, context);
		if (!result.ok) return result;
		const lines = result.value.split("\n");
		return ok<string[], FileError>(options?.maxLines === undefined ? lines : lines.slice(0, options.maxLines));
	}
	async readBinaryFile(path: string, _context: Context) {
		const value = this.files.get(this.path(path));
		return value
			? ok<Uint8Array, FileError>(value)
			: ({ ok: false, error: new FileError("not_found", "not found", this.path(path)) } as const);
	}
	async writeFile(path: string, content: string | Uint8Array, _context: Context) {
		this.files.set(this.path(path), typeof content === "string" ? new TextEncoder().encode(content) : content);
		return ok<void, FileError>(undefined);
	}
	async appendFile(path: string, content: string | Uint8Array, context: Context) {
		const previous = await this.readBinaryFile(path, context);
		const next = typeof content === "string" ? new TextEncoder().encode(content) : content;
		const combined = new Uint8Array((previous.ok ? previous.value.length : 0) + next.length);
		if (previous.ok) combined.set(previous.value, 0);
		combined.set(next, previous.ok ? previous.value.length : 0);
		this.files.set(this.path(path), combined);
		return ok<void, FileError>(undefined);
	}
	async truncateFile(path: string, size: number, context: Context) {
		const current = await this.readBinaryFile(path, context);
		if (!current.ok) return current as Result<void, FileError>;
		const next = new Uint8Array(size);
		next.set(current.value.subarray(0, size));
		this.files.set(this.path(path), next);
		return ok<void, FileError>(undefined);
	}
	async flushFile(_path: string, _context: Context) {
		return ok<void, FileError>(undefined);
	}
	async renameFile(sourcePath: string, destinationPath: string, context: Context) {
		const current = await this.readBinaryFile(sourcePath, context);
		if (!current.ok) return current as Result<void, FileError>;
		this.files.set(this.path(destinationPath), current.value);
		this.files.delete(this.path(sourcePath));
		return ok<void, FileError>(undefined);
	}
	async fileInfo(path: string, context: Context) {
		const current = await this.readBinaryFile(path, context);
		if (!current.ok) return current as Result<FileInfo, FileError>;
		const full = this.path(path);
		return ok<FileInfo, FileError>({
			name: posix.basename(full),
			path: full,
			kind: "file",
			size: current.value.length,
			mtimeMs: 0,
		});
	}
	async listDir(_path: string, _context: Context) {
		return ok<FileInfo[], FileError>([]);
	}
	async canonicalPath(path: string, _context: Context) {
		return ok<string, FileError>(this.path(path));
	}
	async exists(path: string, _context: Context) {
		return ok<boolean, FileError>(this.files.has(this.path(path)));
	}
	async createDir(_path: string, _options: { recursive?: boolean } | undefined, _context: Context) {
		return ok<void, FileError>(undefined);
	}
	async remove(path: string, _options: { recursive?: boolean; force?: boolean } | undefined, _context: Context) {
		this.files.delete(this.path(path));
		return ok<void, FileError>(undefined);
	}
	async createTempDir(_prefix: string | undefined, _context: Context) {
		return ok<string, FileError>("/tmp/memory-dir");
	}
	async createTempFile(_options: { prefix?: string; suffix?: string } | undefined, _context: Context) {
		return ok<string, FileError>("/tmp/memory-file");
	}
	async exec(
		_command: string,
		_options: ShellExecOptions | undefined,
		_context: Context,
	): Promise<Result<ShellExecResult, ExecutionError>> {
		return { ok: false, error: new ExecutionError("shell_unavailable", "memory env has no shell") };
	}
	async cleanup(_context: Context) {}
}

function fakeApi(env: ExecutionEnv): ToolExecutionApi {
	return {
		taskId: 1,
		conversationId: 1,
		callId: "portability",
		env,
		output: () => {},
		diagnostic: () => {},
		details: async () => {},
	} as unknown as ToolExecutionApi;
}

async function run(tool: ToolRegistration, args: JsonValue, env: ExecutionEnv) {
	return tool.execute(args, fakeApi(env), BACKGROUND_CONTEXT);
}

describe("ExecutionEnv portability contract", () => {
	it("runs the same durable write/read tools on a non-Node in-memory provider", async () => {
		const env = new MemoryExecutionEnv();

		await expect(run(createWriteTool(), { path: "hello.txt", content: "portable" }, env)).resolves.toMatchObject({
			content: [{ type: "text", text: "Successfully wrote to hello.txt" }],
		});

		const read = await run(createReadTool(), { path: "hello.txt" }, env);
		expect(read.content).toEqual([{ type: "text", text: "portable" }]);
		expect(env.id).toBe("memory:test");
	});
});
