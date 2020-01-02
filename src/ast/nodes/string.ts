import {maybe}    from '../tools/maybe';
import {optional} from '../tools/optional';
import {Str}      from '../types';

export const parseString = maybe<Str>(stream => {
    const string = optional(stream, false, 'str');

    if (string !== null && !(string as string).length) {
        stream.throwError('Strings shouldn\'t be empty.');
    }

    return string ? {
        type: 'string',
        value: string
    } as Str : null;
});
