/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source
 * @returns Streaming object
 */
export class Streamable<T> {

    public index: number;
    protected readonly source: string | null;
    protected readonly vals: ArrayLike<T>;
    protected readonly length: number;
    private readonly stashed: Array<number>;

    constructor(vals: ArrayLike<T>, source: string | null = null) {
        this.vals = vals;
        this.length = vals.length;
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
}
