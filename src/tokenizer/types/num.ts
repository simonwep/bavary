import {Streamable}       from '../../streams/streamable';
import {isNumeric}        from '../tools/is';
import {Alternate, Token} from '../types';

export const num = (stream: Streamable<string>): Token | Alternate => {
    let decimal = false;
    let sign = false;
    let number = '';

    stream.stash();
    while (stream.hasNext()) {
        const ch = stream.peek() as string;

        if (ch === '-' || ch === '+') {
            if (sign) {
                break;
            }

            sign = true;
        } else if (ch === '.') {
            if (decimal) {
                break;
            }

            decimal = true;
        } else if (!isNumeric(ch)) {
            break;
        }

        number += ch;
        stream.next();
    }

    if (!number.length || !isNumeric(number[number.length - 1])) {
        stream.pop();
        return Alternate.FAILED;
    }

    stream.recycle();
    return {
        type: 'num',
        value: Number(number)
    } as Token;
};
