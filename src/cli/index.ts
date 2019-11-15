/* eslint-disable no-console */
import {blueBright, cyan, yellow} from 'chalk';
import program                    from 'commander';
import * as fs                    from 'fs';
import glob                       from 'glob';
import path                       from 'path';
import {compile}                  from '../core';
import {Parser}                   from '../core/compiler/types';
import parse                      from './parse';
import watchDeclarations          from './watch-declarations';
import watchSource                from './watch-source';

// TODO: Dynamically inject env vars
program
    .name('bvc')
    .description('Bavary cli')
    .usage('[files] [input] [options...]')
    .option('-w, --watch', 'Watch and auto-reload on changes')
    .version('0.0.4', '-v, --version')
    .parse(process.argv);

const [globSource, input] = program.args.map(v => path.resolve(v));

// Validate base arguments
if (!globSource) {
    throw new Error('Missing declaration source.');
} else if (!input) {
    throw new Error('Missing input file.');
} else if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
    throw new Error(`File does not exist or isn't a file: ${input}`);
}

console.log(`Using bavary: ${blueBright('v0.0.4')}`);
console.log(`Declarations: ${blueBright(globSource)}`);
console.log(`Source: ${blueBright(input)}`);
console.log();

if (program.watch) {
    console.log(cyan('>> Watching declartions and source file(s)...'));
    let storedParser: Parser | null = null;
    let storedSource = '';

    watchDeclarations(globSource, parser => {
        storedParser = parser;
        parse(storedSource, parser);
    });

    watchSource(input, source => {
        storedSource = source;
        parse(storedSource, storedParser);
    });
} else {

    // Resolve files and compile source
    glob(globSource, {}, (err, matches) => {

        if (err) {
            throw err;
        }

        for (const match of matches) {
            console.log(blueBright(` [info] Include ${match}`));
        }

        console.log(yellow('Compiling...'));
        const source = fs.readFileSync(input, 'utf8');
        const declarations = matches
            .map(v => fs.readFileSync(v, 'utf8'))
            .join('\n');

        parse(source, compile(declarations));

        process.exit(0);
    });
}
