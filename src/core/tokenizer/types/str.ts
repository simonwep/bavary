import {Streamable}     from '../../stream';
import {consumeEscaped} from '../tools/escaped';
import {RawType}        from '../types';

export const str = (stream: Streamable<string>): RawType | null => {

    for (const char of ['\'', '"', '`']) {
        stream.stash();

        if (stream.peek() === char) {
            stream.next();

            const value = consumeEscaped(stream, char);
            if (value !== null) {
                return {
                    type: 'str',
                    value
                } as RawType;
            }
        }

        stream.pop();
    }

    return null;
};
