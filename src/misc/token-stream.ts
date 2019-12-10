import {RawType}    from '../tokenizer/types';
import {Streamable} from './stream';

export class TokenStream extends Streamable<RawType> {

    next(includeWhitespace = false): RawType | null {
        const {index, length, vals} = this;

        if (includeWhitespace && index < length) {
            return vals[this.index++];
        }

        for (let i = index; i < length; i++) {
            if (vals[i].type !== 'ws') {
                this.index = i + 1;
                return vals[i];
            }
        }

        return null;
    }

    peek(includeWhitespace = false): RawType | null {
        const {index, length, vals} = this;

        if (includeWhitespace && index < length) {
            return vals[index];
        }

        for (let i = index; i < length; i++) {
            if (vals[i].type !== 'ws') {
                return vals[i];
            }
        }

        return null;
    }

    hasNext(includeWhitespace = false): boolean {
        return this.peek(includeWhitespace) !== null;
    }
}
