import { babel } from '@rollup/plugin-babel';
// import { terser } from "rollup-plugin-terser";

const config = {
    input: 'src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'esm',
    },
    plugins: [
        babel({ babelHelpers: 'bundled' }),
        // terser(),
        {
            name: 'wrapper',
            generateBundle(outputOptions, bundle) {
                console.log(Object.keys(bundle));
                const entry = Object.values(bundle).find((chunk) => { 
                    console.log(chunk);
                    return chunk.isEntry
                });
                // Deleting this prevents the standard main.js file output. If you want to go back to the standard output delete the line below and remove this.emit file.                
                delete bundle['main.js'];
                // Emits extra file. You can prevent files from being emitted if you delete them from the bundle object.
                this.emitFile({
                    type: 'asset',
                    fileName: 'main.js',
                    source: '<script>' + entry.code.trim() + '</script>'
                });
            }
        }
    ],
};

export default config;