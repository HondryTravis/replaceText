import path from 'path'
import typescript from 'rollup-plugin-typescript2'
const { terser } = require('rollup-plugin-terser')
import nodeResolve from '@rollup/plugin-node-resolve'
import chalk from 'chalk'



const entryFile = './src/index.ts'


const OUTPUT_CJS = 'cjs';
const OUTPUT_IIFE = 'iife';
const OUTPUT_ES = 'es';
const OUTPUT_UMD = 'umd';

const pkg = require(path.resolve(`package.json`))
const pkgOpts = pkg.buildOptions || {}

const FORMAT = process.env.FORMAT || false

const outputConfigs = {
    [OUTPUT_UMD]: {
        file: path.resolve(`dist/${pkgOpts.name}.umd.js`),
        format: OUTPUT_UMD
    },
    [OUTPUT_ES]: {
        file: path.resolve(`dist/${pkgOpts.name}.es.js`),
        format: OUTPUT_ES
    },
    [OUTPUT_IIFE]: {
        file: path.resolve(`dist/${pkgOpts.name}.global.js`),
        format: OUTPUT_IIFE
    },
    [OUTPUT_CJS]: {
        file: path.resolve(`dist/${pkgOpts.name}.cjs.js`),
        format: OUTPUT_CJS,
    }
}


const defaultFormats = [OUTPUT_CJS, OUTPUT_ES, OUTPUT_IIFE]



function createConfig(format, output, plugins = []) {

    if (!output) {
        console.log(chalk.yellow(`invalid format: "${format}"`))
        process.exit(1)
    }

    if (format === 'iife') {
        output.name = pkgOpts.name
    }

    const extensions = ['.ts']
    const noDeclaration = false

    const tsProject = typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigOverride: {
            compilerOptions: {
                declaration: noDeclaration
            }
        }
    })

    return {
        input: entryFile,
        plugins: [
            nodeResolve({
                extensions
            }),
            tsProject,
            terser({
                compress: {
                    ecma: 2015,
                    pure_getters: true
                }
            }),
            ...plugins,
        ],
        output
    }
}


const packageConfigs = FORMAT && [createConfig(FORMAT, outputConfigs[process.env.FORMAT])] || defaultFormats.map(format => createConfig(format, outputConfigs[format]))


export default packageConfigs;
