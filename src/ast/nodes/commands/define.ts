import {parseGroup, parseLiteral, parseMemberExpression} from '../../internal';
import {maybe}                                           from '../../tools/maybe';
import {DefineStatement}                                 from '../../types';

export const parseDefineStatement = maybe<DefineStatement>(stream => {
    const name = stream.expect(false, 'kw');
    stream.expect(false, 'punc', '=');

    const value = parseLiteral(stream) || parseGroup(stream) || parseMemberExpression(stream);
    if (!value) {
        stream.throw('Expected group, string or variable lookup.');
    }

    return {
        type: 'define',
        name, value
    } as DefineStatement;
});
