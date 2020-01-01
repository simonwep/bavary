import {Streamable}              from '../../streamable';
import {RangeInformation, Token} from '../types';
import {ParsingError}            from './parsing-error';

export class TokenStream extends Streamable<Token> {

    next(includeWhitespace = false): Token | null {
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

    peek(includeWhitespace = false): Token | null {
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

    /**
     * Throws an ParsingError
     * @param msg
     */
    throwError(msg: string): never {
        const {index, source} = this;

        /* istanbul ignore if */
        if (!source) {

            // Currently not used, maybe in the future
            throw new ParsingError(msg);
        } else if (this.hasNext()) {

            // Expect peeked value to be of type RangeInformation
            const peek = this.peek() as RangeInformation;
            throw new ParsingError(source, msg, peek.start, peek.end);
        }

        // Otherwise use current index as start and end value
        throw new ParsingError(source, msg, index, index);
    }
}
