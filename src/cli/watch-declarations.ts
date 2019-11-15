/* eslint-disable no-console */
import {redBright, yellow} from 'chalk';
import chokidar            from 'chokidar';
import * as fs             from 'fs';
import {compile}           from '../core';
import {Parser}            from '../core/compiler/types';

export default (glob: string, cb: (parser: Parser) => void): void => {
    const source: Map<string, string> = new Map(); // TODO: Parse declarations instead of recompile every time

    const compileFiles = (): void => {
        console.log(yellow('Recompile...'));

        // Merge sources
        const fullSource = [...source.values()].join('\n').trim();
        let parser = null;

        try {
            parser = compile(fullSource);
        } catch (e) {
            console.log(redBright('Error:'));
            console.log(e.message);
            return;
        }

        // Call callback with parser
        cb(parser);
    };

    // Watch and recompile declarations
    chokidar.watch(glob, {
        interval: 500,
        binaryInterval: 500
    }).on('change', file => {
        source.set(file, fs.readFileSync(file, 'utf8'));
        compileFiles();
    }).on('add', file => {
        source.set(file, fs.readFileSync(file, 'utf8'));
        compileFiles();
    }).on('unlink', file => {
        source.delete(file);
        compileFiles();
    });
}
