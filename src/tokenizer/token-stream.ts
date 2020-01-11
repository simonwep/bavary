import {ParsingError}                       from '../streams/parsing-error';
import {Streamable}                         from '../streams/streamable';
import {RangeInformation, Token, TokenType} from './types';

/* istanbul ignore next */
export class TokenStream extends Streamable<Token> {

    private readonly source: string;

    constructor(vals: Array<Token>, source: string) {
        super(vals);
        this.source = source;
    }

    next(includeWhitespace = false): Token | never {
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

        this.throw('Unexpected end of input');
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
    match(includeWhitespace = false, type: TokenType, ...values: Array<unknown>): boolean {
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
    optional<T = string | number>(includeWhitespace = false, type: TokenType, ...values: Array<T>): T | null {
        const peek = this.peek(includeWhitespace);

        // Check if type matches
        if (!peek || peek.type !== type) {
            return null;
        }

        // Check if next token matches the given condition
        return this.match(includeWhitespace, type, ...values) ?
            this.next(includeWhitespace).value as unknown as T :
            null;
    }

    /**
     * Same as match but it'll throw an error if the conditions aren't met
     */
    expect<T = string | number>(includeWhitespace = false, type: TokenType, ...values: Array<T>): T | never {

        // Check if next token matches type and value
        const expected = this.optional(includeWhitespace, type, ...values);
        if (expected !== null) {
            return expected;
        }

        if (this.hasNext(includeWhitespace)) {
            const nxt = this.next(includeWhitespace);
            this.throw(`Expected ${values.join(', ')} (${type}) but got ${nxt.value} (${nxt.type})`);
        }

        this.throw('Unxpected end of input.');
    }

    /**
     * Throws an ParsingError
     * @param msg Error message
     */
    throw(msg: string): never {
        const {source} = this;

        if (this.hasNext() && source) {

            // Expect peeked value to be of type RangeInformation
            const peek = this.peek() as RangeInformation;
            throw new ParsingError(msg, source, peek.start, peek.end);
        }

        // Throw regular error
        throw new Error(msg);
    }
}
