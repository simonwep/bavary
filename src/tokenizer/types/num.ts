import Streamable  from '../../stream';
import {isNumeric} from '../tools/is';
import {RawType}   from '../types';

export default (stream: Streamable<string>): RawType | null => {

    let number = '';
    while (stream.hasNext()) {
        const ch = stream.peek() as string;

        if (isNumeric(ch)) {
            number += ch;
        } else {
            break;
        }

        stream.next();
    }

    return number.length ? {
        type: 'num',
        value: Number(number)
    } as RawType : null;
};
