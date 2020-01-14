import {Streamable} from '../../streams/streamable';

export const cmt = (stream: Streamable<string>): null => {

    // Check if token could be the beginning of a comment
    if (stream.peek() === '#') {
        while (stream.hasNext()) {
            if (stream.peek() === '\n') {
                break;
            }

            stream.next();
        }
    }

    return null;
};
