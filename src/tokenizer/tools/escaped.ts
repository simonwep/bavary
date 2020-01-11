import {Streamable} from '../../streams/streamable';

export const consumeEscaped = (stream: Streamable<string>, end: string): string | null => {
    let escaped = false;
    let str = '';

    for (let ch = stream.next(); ; ch = stream.next()) {

        // Disallow line-breaks in escaped sequences
        if (ch === '\n' && !escaped) {
            return null;
        }

        if (escaped) {
            escaped = false;
        } else if (ch === '\\') {
            escaped = true;

            // Don't include end or escape-character if escaped
            const peek = stream.peek();
            if (peek === end || peek === '\\') {
                continue;
            }
        } else if (ch === end) {
            return str;
        } else if (!stream.hasNext()) {
            break;
        }

        str += ch;
    }

    return null;
};
