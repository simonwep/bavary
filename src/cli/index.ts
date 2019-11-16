/* eslint-disable no-console */
import {blueBright, red} from 'chalk';
import program           from 'commander';
import * as fs           from 'fs';
import path              from 'path';
import compilation       from './actions/compilation';

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
    console.log(red('Error: Missing declarations source.'));
    program.help();
} else if (!input) {
    console.log(red('Error: Missing input file.'));
    program.help();
} else if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
    console.log(red(`Error: File does not exist or isn't a file: ${input}`));
    program.help();
}

console.log(`Using bavary: ${blueBright('v0.0.4')}`);
compilation(globSource, input, program.watch);
