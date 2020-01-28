import {Streamable}       from '../../streams/streamable';
import {isNumeric}        from '../tools/is';
import {Alternate, Token} from '../types';

export const num = (stream: Streamable<string>): Token | Alternate => {

    // TODO: Negative?
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
    } as Token : Alternate.FAILED;
};
