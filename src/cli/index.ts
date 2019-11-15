/* eslint-disable no-console */
import {blueBright, green} from 'chalk';
import program             from 'commander';
import watchDeclarations   from './watch-declarations';

// TODO: Dynamically inject env vars
const rest = program
    .name('bvc')
    .description('Bavary cli')
    .usage('[files] [input] [options...]')
    .version('0.0.4', '-v, --version')
    .parse(process.argv);

const [glob, input] = rest.args;
console.log(`Watching: ${blueBright(glob)}`);
console.log(`Input: ${blueBright(input)}`);
console.log();

watchDeclarations(glob, parser => {
    console.log(green('Compiled!'));
    console.log(parser(input));
});
