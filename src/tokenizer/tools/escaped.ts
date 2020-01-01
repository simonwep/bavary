import {Streamable} from '../../streamable';

export const consumeEscaped = (stream: Streamable<string>, end: string): string | null => {
    let escaped = false;
    let str = '';

    for (let ch = stream.next(); ; ch = stream.next()) {

        // Disallow line-breaks in escaped sequences
        if (ch === '\n' && !escaped) {
            return null;
        }

        if (escaped) {
            str += ch;
            escaped = false;
        } else if (ch === '\\') {
            escaped = true;
        } else if (ch === end) {
            return str;
        } else if (!stream.hasNext()) {
            break;
        } else {
            str += ch;
        }
    }

    return null;
};
