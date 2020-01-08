import {Streamable}                 from '../../streamable';
import {consumeWhile}               from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {Token}                      from '../types';

export const kw = (stream: Streamable<string>): Token | null => {

    // TODO: Should a keyword contain numeric characters?
    const str = consumeWhile(stream, (v, c) => {
        return isNonWhitespace(v) || !!(isNumeric(v) && c.length);
    });

    return str.length ? {
        type: 'kw',
        value: str
    } as Token : null;
};
