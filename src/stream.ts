import ParsingError from './misc/parsing-error';

/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source-code to prettify error messages
 * @returns Streaming object
 */

export default class Streamable<T> {

    public index: number;
    private readonly vals: ArrayLike<T>;
    private readonly source: string | null;
    private stashed: Array<number>;

    constructor(vals: ArrayLike<T>, source: string | null = null) {
        this.vals = vals;
        this.source = source;
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
    next(): T {
        return this.vals[this.index++];
    }

    /**
     * Returns the next item without modifying the cursor
     */
    peek(): T {
        return this.vals[this.index];
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
     * Throws an ParsingError
     * @param msg
     */
    throwError(msg): void {

        if (!this.source) {
            throw msg;
        }

        throw new ParsingError(this.source, msg, this.index, this.index);
    }
}
