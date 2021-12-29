import path from 'path';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const resolve = (p) => path.resolve(__dirname, p);
const pkg = require(resolve(`package.json`));
const name = 'rxjs-form';
const globalName = 'RxJSForm';

const extensions = ['.ts', '.tsx'];
const sourceMap = !!process.env.SOURCE_MAP;
const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};
const makeTypescript = (declaration = true) => {
  return typescript({
    check: declaration,
    tsconfig: resolve('tsconfig.json'),
    cacheRoot: resolve('node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: sourceMap,
        declaration: declaration,
        declarationMap: declaration,
        declarationDir: resolve('temp/types')
      }
    }
  });
};

const globals = {
  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators'
};
const outputConfigs = {
  // common js
  cjs: {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.js`),
      format: `cjs`
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      makeTypescript(true),
      babel({
        babelHelpers: 'bundled'
      })
    ]
  },
  // ES
  'esm': {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.esm.js`),
      format: `es`
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      commonjs({
        sourceMap: false
      }),
      makeTypescript(false),
      babel({
        babelHelpers: 'bundled'
      })
    ]
  },
  // ES for Browsers
  'esm-browser': {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.esm-browser.js`),
      format: `es`
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      commonjs({
        sourceMap: false
      }),
      makeTypescript(false),
      babel({
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        module: true,
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        safari10: true
      })
    ]
  },
  // umd
  umd: {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.umd.js`),
      name: globalName,
      format: `umd`,
      globals
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      commonjs({
        sourceMap: false
      }),
      makeTypescript(true),
      babel({
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },
  // umd
  'umd-prod': {
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/${name}.umd.prod.js`),
      name: globalName,
      format: `umd`,
      globals
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      commonjs({
        sourceMap: false
      }),
      makeTypescript(true),
      babel({
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        module: true,
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        safari10: true
      })
    ]
  }
};

const defaultFormats = ['cjs', 'esm', 'esm-browser', 'umd', 'umd-prod'];
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',');
const packageFormats = inlineFormats || defaultFormats;
const packageConfigs = packageFormats.map((format) => {
  return {
    ...outputConfigs[format],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
    treeshake: {
      moduleSideEffects: true
    }
  };
});

export default packageConfigs;
