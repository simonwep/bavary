import Streamable                   from '../../stream';
import {RawType}                    from '../index';
import consume                      from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';

export default (stream: Streamable<string>): RawType | null => {

    if (isNonWhitespace(stream.peek())) {
        const str = consume(stream, v => isNonWhitespace(v) || isNumeric(v));

        return str ? {
            type: 'kw',
            value: str.toLowerCase()
        } as RawType : null;
    }

    return null;

};
