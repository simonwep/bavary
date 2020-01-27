import {parseLiteral}    from '../../internal';
import {maybe}           from '../../tools/maybe';
import {ReturnStatement} from '../../types';

export const parseReturnStatement = maybe<ReturnStatement>(stream => {
    const value = parseLiteral(stream);

    if (!value) {
        stream.throw('Expected literal');
    }

    return {
        type: 'return',
        value
    } as ReturnStatement;
});
