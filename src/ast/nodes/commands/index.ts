import {maybe}                from '../../tools/maybe';
import {GroupCommand}         from '../../types';
import {parseDefineStatement} from './define';
import {parsePushStatement}   from './push';
import {parseThrowStatement}  from './throw';
import {parseVoidStatement}   from './void';

export const parseGroupStatement = maybe<GroupCommand>(stream => {
    const match = stream.optional(false, 'kw', 'def', 'push', 'void', 'throw');

    switch (match) {
        case 'def': {
            return parseDefineStatement(stream);
        }
        case 'push': {
            return parsePushStatement(stream);
        }
        case 'void': {
            return parseVoidStatement(stream);
        }
        case 'throw': {
            return parseThrowStatement(stream);
        }
    }

    return null;
});
