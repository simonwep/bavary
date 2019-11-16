/* eslint-disable no-console */
import {blueBright, cyan, yellow} from 'chalk';
import * as fs                    from 'fs';
import glob                       from 'glob';
import {compile}                  from '../../core';
import {Parser}                   from '../../core/compiler/types';
import parse                      from './parse';
import watchDeclarations          from './watch-declarations';
import watchSource                from './watch-source';

/**
 * Responsible for compilatation and watching source-files
 * @param input
 * @param globSource
 * @param watch
 */
export default (globSource: string, input: string, watch: boolean): void => {
    console.log(`Declarations: ${blueBright(globSource)}`);
    console.log(`Source: ${blueBright(input)}`);
    console.log();

    if (watch) {
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

}
