import ParsingError from './misc/parsing-error';

/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source-code to prettify error messages
 * @returns Streaming object
 */

export default class Streamable<T> {

    private readonly vals: ArrayLike<T>;
    private readonly source: string | null;
    private stashed: Array<number>;
    public index: number;

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
     * Throws an ParsingError
     * @param msg
     */
    throwError(msg: string): void {

        if (!this.source) {
            throw new Error(msg);
        }

        // TODO. This solution is terrible, fix that
        const peek = this.peek() as {
            start: number;
            end: number;
        } | null;

        if (peek) {
            throw new ParsingError(this.source, msg, peek.start, peek.end);
        }
    }
}
