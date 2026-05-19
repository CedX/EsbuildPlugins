import {minifyHtmlLiterals} from "@cedx/esbuild-plugins";
import esbuild from "esbuild";

const buildOptions = { /* Your configuration. */ };
await esbuild.build({
	...buildOptions,
	plugins: [minifyHtmlLiterals()]
});
