import {parseGroup, parseString}    from '../../internal';
import {maybe}                      from '../../tools/maybe';
import {GroupObjectDefineStatement} from '../../types';

export const parseGroupObjectDefineStatement = maybe<GroupObjectDefineStatement>(stream => {
    const name = stream.expect(false, 'kw');
    stream.expect(false, 'punc', '=');

    const value = parseString(stream) || parseGroup(stream);
    if (!value) {
        stream.throwError('Expected group or string');
    }

    return {
        type: 'define',
        name, value,
    } as GroupObjectDefineStatement;
});
