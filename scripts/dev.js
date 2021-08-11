/*
# specify the format to output
yarn dev -f cjs
*/
const execa = require('execa')
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))
const format = args.format || args.f

execa(
    'rollup',
    [
        '-wc',
        '--environment',
        [`FORMAT:${format || 'iife'}`].join(',')
    ],
    {
        stdio: 'inherit'
    }
)
