import {parseGroup}                 from '../../internal';
import {maybe}                      from '../../tools/maybe';
import {GroupObjectDefineStatement} from '../../types';

export const parseGroupObjectDefineStatement = maybe<GroupObjectDefineStatement>(stream => {
    const name = stream.expect(false, 'kw');
    stream.expect(false, 'punc', '=');

    const value = stream.optional(false, 'str') || parseGroup(stream);
    if (!value) {
        stream.throwError('Expected group or string');
    }

    return {
        type: 'define',
        name, value,
    } as GroupObjectDefineStatement;
});
