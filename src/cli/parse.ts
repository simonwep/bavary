/* eslint-disable no-console */
import {green, red} from 'chalk';
import {Parser}     from '../core/compiler/types';

export default (source = '', parser: Parser | null): void => {
    if (parser) {
        const result = parser(source);

        if (result === null) {
            console.log(red('Nothing matched'));
        } else {
            console.log();
            console.log(green(
                JSON.stringify(result, null, 2)
            ));
        }
    } else {
        console.log('Waiting until files are compiled...');
    }
};
