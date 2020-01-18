import {Streamable}                 from '../../streams/streamable';
import {consumeWhile}               from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {Alternate, Token}           from '../types';

export const kw = (stream: Streamable<string>): Token | Alternate => {
    const str = consumeWhile(stream, (v, c) => {
        return isNonWhitespace(v) || !!(isNumeric(v) && c.length);
    });

    return str.length ? {
        type: 'kw',
        value: str
    } as Token : Alternate.FAILED;
};
