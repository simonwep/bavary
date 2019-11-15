import Streamable from '../../stream';
import escaped    from '../tools/escaped';
import {RawType}  from '../types';

export default (stream: Streamable<string>): RawType | null => {

    for (const char of ['\'', '"', '`']) {
        stream.stash();

        if (stream.peek() === char) {
            stream.next();

            const value = escaped(stream, char);
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
