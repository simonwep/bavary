/* eslint-disable no-console */
import {redBright} from 'chalk';
import chokidar    from 'chokidar';
import * as fs     from 'fs';

export default (path: string, cb: (source: string) => void): void => {

    // Watch and recompile declarations
    chokidar.watch(path).on('change', file => {
        cb(fs.readFileSync(file, 'utf8'));
    }).on('unlink', () => {
        console.log(redBright('Source file not longer available...'));
        process.exit(0);
    });
}
