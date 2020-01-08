import {maybe}                           from '../../tools/maybe';
import {GroupStatement}                  from '../../types';
import {parseGroupArrayPushStatement}    from './array-push';
import {parseGroupObjectDefineStatement} from './object-define';

export const parseGroupStatement = maybe<GroupStatement>(stream => {
    const match = stream.optional(false, 'kw', 'def', 'push');

    switch (match) {
        case 'def': {
            return parseGroupObjectDefineStatement(stream);
        }
        case 'push': {
            return parseGroupArrayPushStatement(stream);
        }
    }

    return null;
});
