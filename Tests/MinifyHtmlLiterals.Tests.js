import {minifyHtmlLiterals} from "@cedx/esbuild-plugins";
import esbuild from "esbuild";
import {equal} from "node:assert/strict";
import {Buffer} from "node:buffer";
import {join} from "node:path";
import {describe, it} from "node:test";

/**
 * Tests the features of the `minifyHtmlLiterals` plug-in.
 */
describe("minifyHtmlLiterals", () => {
	it("should minify `html` template literals from a template", async () => {
		const bundle = await esbuild.build({
			bundle: true,
			entryPoints: [join(import.meta.dirname, "../Resources/HtmlTemplate.js")],
			external: ["lit"],
			format: "esm",
			plugins: [minifyHtmlLiterals()],
			write: false
		});

		const [{contents}] = bundle.outputFiles;
		const actual = Buffer.from(contents).toString();
		const expected = `
			// Resources/HtmlTemplate.js
			import { html } from "lit";
			var htmlTemplate = html\`<p>Bonjour le monde !</p><input type="text"> <button type="button">Bouton</button>\`;
			export {
				htmlTemplate
			};
		`;

		equal(actual.trim(), expected.replace(/^\t{3}/gm, "").replaceAll("\t", "  ").trim());
	});
});
