import {maybe}                from '../../tools/maybe';
import {GroupCommand}         from '../../types';
import {parseDefineStatement} from './define';
import {parsePushStatement}   from './push';

export const parseGroupStatement = maybe<GroupCommand>(stream => {
    const match = stream.optional(false, 'kw', 'def', 'push');

    switch (match) {
        case 'def': {
            return parseDefineStatement(stream);
        }
        case 'push': {
            return parsePushStatement(stream);
        }
    }

    return null;
});
