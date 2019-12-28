import {maybe}    from '../tools/maybe';
import {optional} from '../tools/optional';
import {Str}      from '../types';

export const parseString = maybe<Str>(stream => {
    const string = optional(stream, false, 'str');

    if (string && !(string.value as string).length) {
        stream.throwError('Strings shouldn\'t be empty.');
    }

    return string ? {
        type: 'string',
        value: string.value
    } as Str : null;
});
