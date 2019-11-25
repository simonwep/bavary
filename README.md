<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/69007379-69befa00-093d-11ea-96ac-816d3e9ea6b4.png" alt="Logo">
</h3>

<br>

<p align="center">
    <img alt="gzip size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/bavary@0.0.3/dist/bavary.min.js?compression=gzip&style=flat-square">
    <img alt="brotli size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/bavary@0.0.3/dist/bavary.min.js?compression=brotli&style=flat-square">
    <a href='https://coveralls.io/github/Simonwep/bavary?branch=master'><img 
       src='https://img.shields.io/coveralls/github/Simonwep/bavary?style=flat-square' 
       alt='Coverage Status'/></a>
    <a href="https://travis-ci.org/Simonwep/bavary"><img
       alt="Build Status"
       src="https://img.shields.io/travis/Simonwep/bavary.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/bavary"><img
       alt="Download count"
       src="https://img.shields.io/npm/dm/bavary.svg?style=flat-square"></a>
    <img alt="Current version" src="https://img.shields.io/github/tag/Simonwep/bavary.svg?color=21068E&label=version&style=flat-square">
    <a href="https://www.patreon.com/simonwep"><img
       alt="Support me"
       src="https://img.shields.io/badge/patreon-support-260DD3.svg?style=flat-square"></a>
</p>


## Getting Started
⚠ Bavary is currently **not stable** and **heavily under development**.
The API might change and all `0.0.x` releases should be treated as test / preview releases.

Install via npm:
```shell
$ npm install bavary
```

Install via yarn:
```shell
$ yarn add bavary
```

Include directly via jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/graceful-ws/dist/bavary.min.js"></script>
```


## Usage
```js 
import {compile} from 'bavary';

// Compile definitions
const parse = compile(`
    entry ['A' | 'B']
`)

// Use compiled definitions to parse a string
const parsed = parse('A');

// Logs "A" to the console
console.log(parsed);
```

Check out the [documentation](docs/syntax.md) to get started or jump directly into one of the examples:

1. [string](docs/examples/string.md) - Parsing strings and support escaped quotes.
2. [hex-color](docs/examples/hex-color.md) - Parsing different kinds of color types in the hexadecimal format.
3. [number](docs/examples/number.md) - Parsing floats and integers with optional scientific notation.


## CLI
Usage:
```bash
$ bvc [files] [options...]
```
Where `files` can be any kind of directory, file or [glob-pattern](https://en.wikipedia.org/wiki/Glob_%28programming%29).
If no output file is specified (via `--output`) it'll print the result to the console.

| Flag | Explanation | Example |
| ---- | ----------- | ------- |
| `-w, --watch` | Watches source-files matched by `[files]` | `$ bva src/**/*.bv input.txt --watch` |
| `-v, --version` | Prints the current version | `$ bva --version` |
| `-o, --output <file>` | Write results to disk | `$ bva --output result.json` |
| `-p, --prettify` | Prettify result (Works only in combination with `--output`)  | `$ bva --output result.json --prettify` |
| `-h, --help` | Shows usage info | `$ bva --help` |
