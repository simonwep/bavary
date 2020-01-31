import {TokenStream}           from '../../../tokenizer/token-stream';
import {maybe}                 from '../../tools/maybe';
import {UnaryExpression}       from '../../types';
import {parseBinaryExpression} from './index';

export const parseUnaryExpression = maybe<UnaryExpression>((stream: TokenStream) => {
    const sign = stream.optional('punc', '!');
    if (!sign) {
        return null;
    }

    const argument = parseBinaryExpression(stream);
    if (!argument) {
        stream.throw('Expected binary expression.');
    }

    return {
        type: 'unary-expression',
        sign, argument
    } as UnaryExpression;
});
