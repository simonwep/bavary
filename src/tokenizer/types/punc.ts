import Streamable      from '../../stream';
import {isPunctuation} from '../tools/is';
import {RawType}       from '../types';

export default (stream: Streamable<string>): RawType | null => {

    if (isPunctuation(stream.peek() as string)) {
        return {
            type: 'punc',
            value: stream.next()
        } as RawType;
    }

    return null;
};
