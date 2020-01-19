import {parseLiteral}   from '../../internal';
import {maybe}          from '../../tools/maybe';
import {ThrowStatement} from '../../types';

export const parseThrowStatement = maybe<ThrowStatement>(stream => {
    const value = parseLiteral(stream);

    if (!value) {
        stream.throw('Expected string');
    }

    return {
        type: 'throw',
        value
    } as ThrowStatement;
});
