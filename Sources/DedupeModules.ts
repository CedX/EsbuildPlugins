import type {Plugin} from "esbuild";
import process from "node:process";
import {packageDirectory} from "pkg-dir";

/**
 * Creates a plug-in that dedupes the specified modules.
 * @param modules The list of modules to dedupe.
 * @param options The plug-in options.
 * @returns The newly created plug-in.
 */
export function dedupeModules(modules: string[], options: DedupeModulesOptions = {}): Plugin {
	return {
		name: "DedupeModules",
		setup: (build) => {
			let {resolveDir = null} = options;
			build.onStart(async () => { resolveDir ??= await packageDirectory() ?? process.cwd(); }); // eslint-disable-line require-atomic-updates
			const resolveOptions = {namespace: "file", filter: new RegExp(`^(${modules.join("|")})(/|$)`)};
			build.onResolve(resolveOptions, async args => await build.resolve(args.path, {kind: args.kind, resolveDir: resolveDir!}));
		}
	};
}

/**
 * Defines the options of the {@link dedupeModules} plug-in.
 */
export type DedupeModulesOptions = Partial<{

	/**
	 * The path of the directory to use when resolving an import path.
	 */
	resolveDir: string;
}>;
