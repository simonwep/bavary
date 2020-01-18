import {Streamable}       from '../../streams/streamable';
import {Alternate, Token} from '../types';

export const cmt = (stream: Streamable<string>): Token | Alternate => {

    // Check if token could be the beginning of a comment
    if (stream.peek() === '#') {
        while (stream.hasNext()) {
            if (stream.peek() === '\n') {
                break;
            }

            stream.next();
        }

        return Alternate.EMPTY;
    }

    return Alternate.FAILED;
};
