import esbuild from 'esbuild';
import vuePlugin from 'esbuild-plugin-vue3';
import flow from 'esbuild-plugin-flow';
//import fs from 'node:fs'

const result = await esbuild.build({
    logLevel: "info",
    entryPoints: ["src/main2.js"],
    bundle: true,
    sourcemap: true,
    minify: true,
    outdir: "static/",
    loader: {
        '.gif': 'dataurl'
    },
    target: [
        'chrome116',
    ],
    plugins: [vuePlugin()],
    metafile: true,
});

//fs.writeFileSync("meta.json", JSON.stringify(result.metafile));