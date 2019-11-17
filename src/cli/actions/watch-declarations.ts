/* eslint-disable no-console */
import chokidar              from 'chokidar';
import * as fs               from 'fs';
import {setTimeout}          from 'timers';
import {parseAST}            from '../../core/ast';
import {Declaration}         from '../../core/ast/types';
import {compileDeclarations} from '../../core/compiler';
import {Parser}              from '../../core/compiler/types';
import {tokenize}            from '../../core/tokenizer';
import {LEVEL, log}          from '../tools/log';
import {createPathString}    from '../tools/prettify-file-path';
import removeFromArray       from '../tools/remove-from-array';

export default (glob: string, cb: (parser: Parser) => void): void => {
    const source: Map<string, Array<Declaration>> = new Map();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const erroredFiles: Array<string> = [];
    let compilationTimeout: null | any = null;
    let parser = null;

    const compileFiles = (): void => {

        // Merge sources
        const fullSource = [];
        for (const decs of source.values()) {
            fullSource.push(...decs);
        }

        try {
            log('Compile...', LEVEL.INFO);
            parser = compileDeclarations(fullSource);
        } catch (e) {
            log('Failed to compile sources', LEVEL.ERROR);
            console.log(e.message);
            return;
        }

        // Call callback with parser
        cb(parser);
    };

    const updateSourceFile = (file: string): void => {
        const defs = fs.readFileSync(file, 'utf8');

        try {
            source.set(file, parseAST(tokenize(defs), defs));

            // File contains no more errors
            if (removeFromArray(erroredFiles, file)) {
                log(`Fixed ${createPathString(file)}`, LEVEL.OK);
            }
        } catch (e) {
            log(`Failed to compile ${createPathString(file)}`, LEVEL.ERROR);
            console.log(e.message);

            log('Waiting for changes...', LEVEL.WARN);
            if (!erroredFiles.includes(file)) {
                erroredFiles.push(file);
            }
        }

        // Compile only if everything is fine
        if (!erroredFiles.length) {

            // Debounce compilation calls
            if (compilationTimeout) {
                clearTimeout(compilationTimeout);
            }

            compilationTimeout = setTimeout(compileFiles, 500);
        }
    };

    // Watch and recompile declarations
    chokidar.watch(glob, {
        interval: 500,
        binaryInterval: 500
    }).on('change', file => {
        log(`Changed: ${createPathString(file)}`, LEVEL.INFO);
        updateSourceFile(file);
    }).on('add', file => {
        log(`Added: ${createPathString(file)}`, LEVEL.INFO);
        updateSourceFile(file);
    }).on('unlink', file => {
        log(`Removed: ${createPathString(file)}`, LEVEL.WARN);

        // Remove file from errored-list and delete ast-tree from it
        removeFromArray(erroredFiles, file);
        source.delete(file);
        compileFiles();
    });
}
