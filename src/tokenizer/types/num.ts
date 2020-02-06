import {Streamable}         from '../../streams/streamable';
import {isNumeric}          from '../tools/is';
import {Token, TokenParser} from '../types';

export const num: TokenParser = (stream: Streamable<string>, tokens: Array<Token>): boolean => {
    const start = stream.index;
    let decimal = false;
    let sign = false;
    let number = '';

    while (stream.hasNext()) {
        const ch = stream.peek() as string;

        if (ch === '-' || ch === '+') {
            if (sign || decimal) {
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
        return false;
    }

    tokens.push({
        type: 'num',
        value: Number(number),
        start,
        end: stream.index
    });

    return true;
};
