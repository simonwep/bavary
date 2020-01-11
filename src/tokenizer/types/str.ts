import {Streamable}     from '../../streams/streamable';
import {consumeEscaped} from '../tools/escaped';
import {Token}          from '../types';

const quotationCharacters = ['\'', '"'];

export const str = (stream: Streamable<string>): Token | null => {

    for (const char of quotationCharacters) {
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
