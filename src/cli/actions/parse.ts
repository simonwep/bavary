/* eslint-disable no-console */
import {green, red}       from 'chalk';
import * as fs            from 'fs';
import {Parser}           from '../../core/compiler/types';
import {createPathString} from '../tools/prettify-file-path';

export default (source = '', parser: Parser | null, output?: string, prettify?: boolean): void => {
    if (parser) {
        const result = parser(source);

        if (result === null) {
            console.log(red('[INFO] Nothing matched'));
        } else if (output) {
            const data = prettify ? JSON.stringify(result, null, 2) : JSON.stringify(result);

            // Write to disk
            fs.writeFileSync(output, data);
            console.log(green(`[SUCCESS] Result saved in ${createPathString(output)}`));
        } else {
            console.log();
            console.log(green(
                JSON.stringify(result, null, 2)
            ));
        }
    } else {
        console.log('[INFO] Waiting until files are compiled...');
    }
};
