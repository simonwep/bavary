import Streamable                   from '../../stream';
import consume                      from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {RawType}                    from '../types';

export default (stream: Streamable<string>): RawType | null => {

    if (isNonWhitespace(stream.peek() as string)) {
        const str = consume(stream, v => isNonWhitespace(v) || isNumeric(v));

        return str ? {
            type: 'kw',
            value: str
        } as RawType : null;
    }

    return null;

};
