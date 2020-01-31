import {parseGroup, parseLiteral, parseMemberExpression, parseReference} from '../../internal';
import {maybe}                                                           from '../../tools/maybe';
import {DefineStatement}                                                 from '../../types';

export const parseDefineStatement = maybe<DefineStatement>(stream => {
    const name = stream.expect('kw');
    stream.expect('punc', '=');

    const value = parseLiteral(stream) ||
        parseGroup(stream) ||
        parseMemberExpression(stream) ||
        parseReference(stream);

    if (!value) {
        stream.throw('Expected group, string or variable lookup.');
    }

    return {
        type: 'define',
        name, value
    } as DefineStatement;
});
