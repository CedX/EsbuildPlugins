import type {Plugin} from "esbuild";
import {minifyHTMLLiterals, type Options} from "minify-html-literals"
import {readFile} from "node:fs/promises";
import {EOL} from "node:os";
import {extname} from "node:path";

/**
 * Creates a plug-in that minifies HTML markup inside template literal strings.
 * @param options The plug-in options.
 * @returns The newly created plug-in.
 */
export function minifyHtmlLiterals(options: MinifyHtmlLiteralsOptions = {}): Plugin {
	return {
		name: "MinifyHtmlLiterals",
		setup: (build) => {
			const {filter = /\.[jt]s$/i, ...minifyOptions} = options;
			const tsExtensions = new Set([".cts", ".mts", ".ts", ".tsx"]);
			build.onLoad({namespace: "file", filter}, async args => {
				const contents = await readFile(args.path, "utf8");
				const {code, map} = minifyHTMLLiterals(contents, minifyOptions) ?? {code: contents, map: null};
				return {
					loader: tsExtensions.has(extname(args.path).toLowerCase()) ? "ts" : "js",
					contents: map ? `${code}${EOL}//# sourceMappingURL=${map.toUrl()}` : code
				};
			});
		}
	};
}

/**
 * Defines the options of the {@link minifyHtmlLiterals} plug-in.
 */
export type MinifyHtmlLiteralsOptions = Options & Partial<{

	/**
	 * The pattern indicating which modules to process when the path matches.
	 */
	filter: RegExp;
}>;
