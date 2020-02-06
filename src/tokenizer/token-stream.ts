import {ParsingError}                       from '../streams/parsing-error';
import {Streamable}                         from '../streams/streamable';
import {RangeInformation, Token, TokenType} from './types';

type TokenPrimitive<T extends TokenType> =
    T extends 'kw' ? string :
        T extends 'str' ? string :
            T extends 'punc' ? string :
                T extends 'num' ? number :
                    unknown;


/* istanbul ignore next */
export class TokenStream extends Streamable<Token> {

    private readonly source: string;

    constructor(vals: Array<Token>, source: string) {
        super(vals);
        this.source = source;
    }

    /**
     * Checks if the next token matches the given conditioons
     */
    match<T extends TokenType>(type: T, ...values: Array<number | string>): boolean {
        const peek = this.peek();

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
    optional<T extends TokenType>(type: T, ...values: Array<number | string>): TokenPrimitive<T> | null {

        // Check if next token matches the given condition
        return this.match(type, ...values) ?
            this.next().value as TokenPrimitive<T> :
            null;
    }

    /**
     * Same as match but it'll throw an error if the conditions aren't met
     */
    expect<T extends TokenType>(type: T, ...values: Array<number | string>): TokenPrimitive<T> | never {

        // Check if next token matches type and
        const expected = this.optional(type, ...values);
        if (expected !== null) {
            return expected;
        }

        if (this.hasNext()) {
            this.next();
            this.throw(values.length ? `Expected ${values.join(' / ')}` : 'Unexpected token.');
        }

        this.throw('Unxpected end of input.');
    }

    /**
     * Throws an ParsingError
     * @param msg Error message
     */
    throw(msg: string): never {
        const {source} = this;
        const current: undefined | RangeInformation = this.vals[this.index - 1];

        if (source && current) {

            // Expect peeked value to be of type RangeInformation
            throw new ParsingError(msg, source, current.start, current.end);
        }

        // Throw regular error
        throw new ParsingError(msg, source, this.index, this.index + 1);
    }
}
