import {parseGroup, parseString} from '../../internal';
import {maybe}                   from '../../tools/maybe';
import {GroupArrayPushStatement} from '../../types';

export const parseGroupArrayPushStatement = maybe<GroupArrayPushStatement>(stream => {
    const value = parseString(stream) || parseGroup(stream);

    if (!value) {
        stream.throwError('Expected group or string');
    }

    return {
        type: 'push',
        value,
    } as GroupArrayPushStatement;
});
