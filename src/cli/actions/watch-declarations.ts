/* eslint-disable no-console */
import {greenBright, redBright, yellow} from 'chalk';
import chokidar                         from 'chokidar';
import * as fs                          from 'fs';
import path                             from 'path';
import {setTimeout}                     from 'timers';
import {parseAST}                       from '../../core/ast';
import {Declaration}                    from '../../core/ast/types';
import {compileDeclarations}            from '../../core/compiler';
import {Parser}                         from '../../core/compiler/types';
import {tokenize}                       from '../../core/tokenizer';

export default (glob: string, cb: (parser: Parser) => void): void => {
    const source: Map<string, Array<Declaration>> = new Map();
    const createPathString = (file: string): string => `${path.basename(file)} (in ${path.dirname(file)})`;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let compilationTimeout: null | any = null;
    let parser = null;

    const compileFiles = (): void => {

        // Merge sources
        const fullSource = [];
        for (const decs of source.values()) {
            fullSource.push(...decs);
        }

        try {
            parser = compileDeclarations(fullSource);
        } catch (e) {
            console.log(redBright('Error:'));
            console.log(e.message);
            return;
        }

        // Call callback with parser
        cb(parser);
    };

    const updateSourceFile = (file: string): void => {
        const defs = fs.readFileSync(file, 'utf8');
        source.set(file, parseAST(tokenize(defs), defs));


        // Debounce compilation calls
        if (compilationTimeout) {
            clearTimeout(compilationTimeout);
        }

        compilationTimeout = setTimeout(compileFiles, 500);
    };

    // Watch and recompile declarations
    chokidar.watch(glob, {
        interval: 500,
        binaryInterval: 500
    }).on('change', file => {
        console.log(yellow(`Changed: ${createPathString(file)})`));
        updateSourceFile(file);
    }).on('add', file => {
        console.log(greenBright(`Added: ${createPathString(file)})`));
        updateSourceFile(file);
    }).on('unlink', file => {
        console.log(redBright(`Removed: ${createPathString(file)})`));
        source.delete(file);
        compileFiles();
    });
}
