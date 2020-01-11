import {Streamable} from '../../streams/streamable';

export const cmt = (stream: Streamable<string>): null => {

    // Check if token could be the beginning of a comment
    if (stream.peek() === '/') {
        stream.stash(); // Save current position in case it's not a comment
        stream.next();  // Skip "/"

        const next = stream.next();
        if (next === '/') {

            // Single-line comment
            while (stream.hasNext()) {

                // A linebreak marks the end of single-line comments
                if (stream.peek() === '\n') {
                    stream.recycle();
                    break;
                }

                stream.next();
            }

        } else if (next === '*') {

            // Multiline comment
            while (stream.hasNext()) {

                // */ marks end of multi-line comments
                if (stream.next() === '*' && stream.next() === '/') {
                    stream.recycle();
                    break;
                }
            }
        } else {
            stream.pop();
        }
    }

    return null;
};
