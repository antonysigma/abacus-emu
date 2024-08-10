import esbuild from 'esbuild';
import vuePlugin from 'esbuild-plugin-vue3';
//import fs from 'node:fs'

const result = await esbuild.build({
    logLevel: "info",
    entryPoints: ["src/main.js"],
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