import {parseGroup}              from '../../internal';
import {maybe}                   from '../../tools/maybe';
import {GroupArrayPushStatement} from '../../types';

export const parseGroupArrayPushStatement = maybe<GroupArrayPushStatement>(stream => {
    const value = stream.optional(false, 'str') || parseGroup(stream);
    if (!value) {
        stream.throwError('Expected group or string');
    }

    return {
        type: 'push',
        value,
    } as GroupArrayPushStatement;
});
