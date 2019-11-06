import Streamable  from '../../stream';
import {RawType}   from '../index';
import {isNumeric} from '../tools/is';

export default (stream: Streamable<string>): RawType | null => {

    let number = '';
    while (stream.hasNext()) {
        const ch = stream.peek();

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
