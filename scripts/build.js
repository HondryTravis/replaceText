const fs = require('fs');
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const { gzipSync } = require('zlib')

start()

async function start() {
    await build()
    checkSize()
}

async function build() {
    await fs.rmdirSync(`dist`, { recursive: true })

    await execa(
        'rollup',
        [
            '-c'
        ],
        { stdio: 'inherit' }
    )
}

function checkSize() {
    const pkg = require(path.resolve(`package.json`))
    const { buildOptions } = pkg

    checkFileSize(path.resolve(`./dist/${buildOptions.name}.global.js`))
    checkFileSize(path.resolve(`./dist/${buildOptions.name}.cjs.js`))
    checkFileSize(path.resolve(`./dist/${buildOptions.name}.es.js`))
}

function checkFileSize(filePath) {
    if (!fs.existsSync(filePath)) {
        return
    }

    const file = fs.readFileSync(filePath)

    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'

    console.log(
        `${chalk.gray(
            chalk.bold(path.basename(filePath))
        )} min:${minSize} / gzip:${gzippedSize}`
    )
}
