import {Streamable}                         from '../../streamable';
import {RangeInformation, Token, TokenType} from '../types';
import {ParsingError}                       from './parsing-error';

/* istanbul ignore next */
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
     * Consumes following whitespace
     */
    consumeSpace(): void {
        if (this.hasNext(true) && (this.peek(true) as Token).type === 'ws') {
            this.next(true);
        }
    }

    /**
     * Checks if the next token matches the given conditioons
     */
    match(includeWhitespace = false, type: TokenType, ...values: Array<string | number>): boolean {
        const peek = this.peek(includeWhitespace);

        // Check if type matches
        if (!peek || peek.type !== type) {
            return false;
        }

        // Check if value matches
        return !values.length || values.includes(peek.value);
    }

    /**
     * Same as match but it'll consume the token if the conditions are met
     */
    optional(includeWhitespace = false, type: TokenType, ...values: Array<string | number>): string | number | null {
        const peek = this.peek(includeWhitespace);

        // Check if type matches
        if (!peek || peek.type !== type) {
            return null;
        }

        // Check if next token matches the given condition
        return this.match(includeWhitespace, type, ...values) ? (this.next(includeWhitespace) as Token).value : null;
    }

    /**
     * Same as match but it'll throw an error if the conditions aren't met
     */
    expect(includeWhitespace = false, type: TokenType, ...values: Array<string | number>): string | number | never {

        // Check if next token matches type and value
        const expected = this.optional(includeWhitespace, type, ...values);
        if (expected !== null) {
            return expected;
        }

        if (this.hasNext(includeWhitespace)) {
            const nxt = this.next(includeWhitespace) as Token;
            this.throwError(`Expected ${values.join(', ')} (${type}) but got ${nxt.value} (${nxt.type})`);
        }

        this.throwError('Unxpected end of input.');
    }

    /**
     * Throws an ParsingError
     * @param msg Error message
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
