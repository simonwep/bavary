import {Streamable}                 from '../../misc/stream';
import {cunsumeWhile}               from '../tools/consume';
import {isNonWhitespace, isNumeric} from '../tools/is';
import {RawType}                    from '../types';

export const kw = (stream: Streamable<string>): RawType | null => {

    if (isNonWhitespace(stream.peek() as string)) {
        const str = cunsumeWhile(stream, v => isNonWhitespace(v) || isNumeric(v));

        return {
            type: 'kw',
            value: str
        } as RawType;
    }

    return null;

};
