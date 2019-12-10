import {Streamable}                 from '../../misc/stream';
import {consumeWhile}               from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {RawType}                    from '../types';

export const kw = (stream: Streamable<string>): RawType | null => {
    const str = consumeWhile(stream, (v, c) => {
        return isNonWhitespace(v) || !!(isNumeric(v) && c.length);
    });

    return str.length ? {
        type: 'kw',
        value: str
    } as RawType : null;
};
