<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/68051553-fd5ebc80-fce7-11e9-9f32-edad69e40584.png" alt="Logo">
</h3>

<p align="center">
    <img alt="gzip size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/bavary/master/dist/bavary.min.js?compression=gzip&style=flat-square">
    <img alt="brotli size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/bavary/master/dist/bavary.min.js?compression=brotli&style=flat-square">
    <a href="htt  ps://travis-ci.org/Simonwep/bavary"><img
       alt="Build Status"
       src="https://img.shields.io/travis/Simonwep/bavary.svg?style=popout-square"></a>
    <a href="https://www.npmjs.com/package/bavary"><img
       alt="Download count"
       src="https://img.shields.io/npm/dm/bavary.svg?style=popout-square"></a>
    <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-1B0466.svg?style=popout-square">
    <img alt="Current version" src="https://img.shields.io/github/tag/Simonwep/bavary.svg?color=21068E&label=version&style=flat-square">
    <a href="https://www.patreon.com/simonwep"><img
       alt="Support me"
       src="https://img.shields.io/badge/patreon-support-260DD3.svg?style=popout-square"></a>
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

1. [number](docs/examples/number.md) - Parsing floats and integers with optional scientific notation.
