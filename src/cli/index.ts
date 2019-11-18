/* eslint-disable no-console */
import {blueBright, red} from 'chalk';
import program           from 'commander';
import * as fs           from 'fs';
import path              from 'path';
import {ENV_VERSION}     from '../env';
import compilation       from './actions/compilation';

program
    .name('bvc')
    .description('Bavary cli')
    .usage('[files] [options...]')
    .option('-w, --watch', 'Watch and auto-reload on changes')
    .option('-o, --output <file>', 'Write parsing results to file')
    .option('-p, --prettify', 'Prettify result (only active if --output is set)')
    .version(ENV_VERSION, '-v, --version')
    .parse(process.argv);

const [globSource, input] = program.args.map(v => path.resolve(v));

// Validate base arguments
if (!globSource) {
    console.log(red('[RERROR] Missing declarations source.'));
    program.help();
} else if (!input) {
    console.log(red('Error: Missing input file.'));
    program.help();
} else if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
    console.log(red(`Error: File does not exist or isn't a file: ${input}`));
    program.help();
}

console.log(`Using bavary: ${blueBright(`v${program._version}`)}`);
compilation(globSource, input, {
    watch: program.watch,
    output: program.output,
    prettify: program.prettify,
});
