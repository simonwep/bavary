import {maybe}                from '../../tools/maybe';
import {GroupCommand}         from '../../types';
import {parseDefineStatement} from './define';
import {parsePushStatement}   from './push';
import {parseRemoveStatement} from './remove';
import {parseReturnStatement} from './return';
import {parseThrowStatement}  from './throw';
import {parseUseStatement}    from './use';
import {parseVoidStatement}   from './void';

export const parseGroupStatement = maybe<GroupCommand>(stream => {
    const match = stream.optional('kw', 'ret', 'def', 'rem', 'use', 'push', 'void', 'throw');

    switch (match) {
        case 'ret': {
            return parseReturnStatement(stream);
        }
        case 'def': {
            return parseDefineStatement(stream);
        }
        case 'use': {
            return parseUseStatement(stream);
        }
        case 'push': {
            return parsePushStatement(stream);
        }
        case 'rem': {
            return parseRemoveStatement(stream);
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
