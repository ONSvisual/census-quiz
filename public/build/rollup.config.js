import svelte from "rollup-plugin-svelte";
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
    input: 'src/main.js',
    output: {
        file: 'public/build/bundle.js',
        format: 'iife',
        name: 'app',
    },
    plugins: [
        svelte({
            include: 'src/**/*.svelte',
        }),
        json(),
        resolve({ browser: true }),

    ],
}
