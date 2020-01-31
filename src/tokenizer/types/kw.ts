import {Streamable}                 from '../../streams/streamable';
import {consumeWhile}               from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {Token, TokenParser}         from '../types';

export const kw: TokenParser = (stream: Streamable<string>, tokens: Array<Token>): boolean => {
    const start = stream.index;
    const str = consumeWhile(stream, (v, c) => {
        return isNonWhitespace(v) || !!(isNumeric(v) && c.length);
    });

    if (str.length) {
        tokens.push({
            type: 'kw',
            value: str,
            start,
            end: stream.index
        });

        return true;
    }

    return false;
};
