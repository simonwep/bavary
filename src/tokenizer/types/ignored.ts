import {Streamable}   from '../../streams/streamable';
import {consumeWhile} from '../tools/consume';
import {isWhiteSpace} from '../tools/is';

export const ignored = (stream: Streamable<string>): void => {
    consumeWhile(stream, isWhiteSpace);

    // Check if token could be the beginning of a comment
    while (stream.peek() === '#') {
        while (stream.hasNext()) {
            if (stream.next() === '\n') {
                consumeWhile(stream, isWhiteSpace);
                break;
            }
        }
    }
};
