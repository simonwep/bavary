import {parseValueAccessor} from '../../internal';
import {maybe}              from '../../tools/maybe';
import {ReturnStatement}    from '../../types';

export const parseReturnStatement = maybe<ReturnStatement>(stream => {
    const value = parseValueAccessor(stream);

    if (!value) {
        stream.throw('Expected string');
    }

    return {
        type: 'return',
        value,
    } as ReturnStatement;
});
