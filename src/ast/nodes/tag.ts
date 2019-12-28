import {parseIdentifier} from '../internal';
import {maybe}           from '../tools/maybe';
import {optional}        from '../tools/optional';
import {Identifier, Tag} from '../types';

export const parseTag = maybe<Tag>(stream => {
    if (!optional(stream, false, 'punc', '#')) {
        return null;
    }

    const ident = parseIdentifier(stream);
    if (!ident) {
        stream.throwError('Expected tag-identifier');
    }

    return {
        type: 'tag',
        value: (ident as Identifier).value // TODO: Is there a bug with the IDE???
    };
});
