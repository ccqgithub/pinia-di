import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { execa, execaSync } from 'execa';
import fs from 'fs-extra';
import minimist from 'minimist';
import { gzipSync } from 'zlib';
import { compress } from 'brotli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = minimist(process.argv.slice(2));
const formats = args.formats || args.f;
const buildTypes = args.types || args.t;
const sourceMap = args.sourcemap || args.s;
const commit = execaSync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7);

(async () => {
  await build();
  await checkSize();
})();

async function build() {
  const pkgDir = process.cwd();

  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(`${pkgDir}/dist`);
    await fs.remove(`${pkgDir}/types`);
  }

  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${commit}`,
        formats ? `FORMATS:${formats}` : ``,
        buildTypes ? `TYPES:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  );

  await fs.move(`${pkgDir}/temp/types/src`, `${pkgDir}/types`);
  await fs.remove(`${pkgDir}/temp`);
}

function checkSize() {
  const pkgDir = __dirname;
  checkFileSize(`${pkgDir}/dist/rxjs-form.global.prod.js`);
}

function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const file = fs.readFileSync(filePath);
  const minSize = (file.length / 1024).toFixed(2) + 'kb';
  const gzipped = gzipSync(file);
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb';
  const compressed = compress(file);
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb';
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  );
}
