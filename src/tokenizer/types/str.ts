import {Streamable}     from '../../streamable';
import {consumeEscaped} from '../tools/escaped';
import {Token}          from '../types';

export const str = (stream: Streamable<string>): Token | null => {

    for (const char of ['\'', '"', '`']) {
        stream.stash();

        if (stream.peek() === char) {
            stream.next();

            const value = consumeEscaped(stream, char);
            if (value !== null) {
                return {
                    type: 'str',
                    value
                } as Token;
            }
        }

        stream.pop();
    }

    return null;
};
