import Streamable      from '../../stream';
import {RawType}       from '../index';
import {isPunctuation} from '../tools/is';

export default (stream: Streamable<string>): RawType | null => {

    if (isPunctuation(stream.peek())) {
        return {
            type: 'punc',
            value: stream.next()
        } as RawType;
    }

    return null;
};
