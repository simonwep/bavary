import {ParsingError} from './parsing-error';

export type RangeInformation = {
    start: number;
    end: number;
}

/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source-code to prettify error messages
 * @returns Streaming object
 */
export class Streamable<T extends RangeInformation | string> {

    private readonly source: string | null;
    protected readonly vals: ArrayLike<T>;
    protected readonly length: number;
    private readonly stashed: Array<number>;
    public index: number;

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
        } else {

            // Otherwise use current index as start and end value
            throw new ParsingError(source, msg, index, index);
        }
    }
}
