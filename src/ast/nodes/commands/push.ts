import {parseGroup, parseString} from '../../internal';
import {maybe}                   from '../../tools/maybe';
import {PushStatement}           from '../../types';

export const parsePushStatement = maybe<PushStatement>(stream => {
    const value = parseString(stream) || parseGroup(stream);

    if (!value) {
        stream.throw('Expected group or string');
    }

    return {
        type: 'push',
        value,
    } as PushStatement;
});
