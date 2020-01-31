import {ParsingError} from './parsing-error';

/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source
 * @returns Streaming object
 */
export class Streamable<T> {

    public index: number;
    protected readonly vals: ArrayLike<T>;
    protected readonly length: number;
    private readonly stashed: Array<number>;

    constructor(vals: ArrayLike<T>) {
        this.vals = vals;
        this.length = vals.length;
        this.index = 0;
        this.stashed = [];
    }

    stash(): void {
        this.stashed.push(this.index);
    }

    pop(): void {
        this.index = this.stashed.pop() as number;
    }

    /**
     * Returns the next item
     */
    next(): T | null {
        return this.hasNext() ? this.vals[this.index++] : null;
    }

    /**
     * Returns the next item without modifying the cursor
     */
    peek(): T | null {
        return this.hasNext() ? this.vals[this.index] : null;
    }

    /**
     * Returns true if there are any values left
     */
    hasNext(): boolean {
        return this.index < this.vals.length;
    }

    /**
     * Removes the last item from the stash
     */
    recycle(): void {
        this.stashed.pop();
    }

    /**
     * Throws an error, a ParsingError if the values
     * are of type string.
     * @param msg error-message
     */

    /* istanbul ignore next */
    throw(msg: string): never {
        const {index, vals} = this;

        if (typeof vals === 'string') {

            // Throw StreamingError
            throw new ParsingError(msg, vals, index - 1, index);
        }

        // Throw regular error
        throw new Error(msg);
    }
}
