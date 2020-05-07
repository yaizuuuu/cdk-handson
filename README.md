# ESLintのインストール

## 参考

* https://qiita.com/HeRo/items/0ee8dbc8a9a3e5a490dd
    * CDKのプロジェクトにESLintを入れる
* https://qiita.com/ishiyama0530/items/c013475c563322965e2a
    * commit前にESLintの実行
* https://qiita.com/ybiquitous/items/553479cfcb2cee124ae0
    * 同上
* https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF
    * gitに用意されるhook
* https://dev.to/elthrasher/exploring-aws-cdk-step-functions-1d1e
    * StandardJSに規約を載せ替えたため、こちらを一番参考にした
    * TSのビルド後は `build` ディレクトリのコードを入れる構成にして、Labmdaの関数もLintの対象とする構成になっている

## ESLintのセットアップ

`npm i -D eslint eslint-import-resolver-typescript eslint-plugin-jest` したのち `./node_modules/eslint/bin/eslint.js --init` を実行する

色々聞かれるので以下の様に答える

```
? How would you like to use ESLint? 
  To check syntax only 
  To check syntax and find problems 
❯ To check syntax, find problems, and enforce code style
? What type of modules does your project use? (Use arrow keys)
❯ JavaScript modules (import/export) 
  CommonJS (require/exports) 
  None of these 
? Which framework does your project use? 
  React 
  Vue.js 
❯ None of these
? Does your project use TypeScript? (y/N) y
? Where does your code run? 
 ◯ Browser
❯◉ Node
? How would you like to define a style for your project? (Use arrow keys)
❯ Use a popular style guide 
  Answer questions about your style 
  Inspect your JavaScript file(s) 
? Which style guide do you want to follow? (Use arrow keys)
  Airbnb: https://github.com/airbnb/javascript 
❯ Standard: https://github.com/standard/standard 
  Google: https://github.com/google/eslint-config-google 
? What format do you want your config file to be in? 
❯ JavaScript 
  YAML 
  JSON 
```

.esllintrc.jsを以下のように設定

```js
module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', js: 'never' }
    ],
    'no-new': 'off',
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' }
    ],
    'max-len': [
      'error',
      { code: 120 }
    ]
  },
  ignorePatterns: ['*.d.ts', 'build', 'cdk.out'],
}
```

package.jsonに以下のように登録

```json
{
  "scripts": {
    "lint": "eslint --ext .ts,.js .",
    "lint:fix": "eslint --ext .ts,.js --fix ."
  },
}
```

`npm run lint` でESLintを走らせる、 `npm run lint:fix` で修正まで実行


tsconfig.jsonを以下の様に修正

* `"outdir": "build"` を追加
* excludeにbuildを追加

```json
{
  "compilerOptions": {
    "target":"ES2018",
    "module": "commonjs",
    "lib": ["es2018"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization":false,
    "typeRoots": ["./node_modules/@types"],
    "outDir": "build"
  },
  "exclude": ["cdk.out", "build"]
}
```

## git commitしたらESLintを走らせ、通らなかったら失敗させる

`npm i -D husky lint-staged` でパッケージをインストール

* husky: package.jsonに記載して、 `husky.hooks.~~~` で任意の処理を挟み込める
* lint-staged: ステージングにあるファイルに対して、任意の処理を実行できる

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": [
      "eslint"
    ]
  }
}
```

`eslint --fix` して `git add` している文献が多い