import previousIndexOf from 'previous-index-of';

/**
 * Returns a fallback-value if value matches
 * @param val Value
 * @param fallback Fallback value
 * @param pred If value equals the predicate the fallback value will be returend
 */
function alternative(val: number, fallback: number, pred = -1): number {
    return val === pred ? fallback : val;
}

/**
 * Prefixes a array of strings with row-numbers
 * @param lines Source code lines
 * @param rows Total amount of rows
 * @param minNumPad Minimum amount of padding for each row-number
 * @param seperator Optional seperator string between row-count and source-line
 * @return Tuple with array of prefixed lines and padding
 */
function addLinePrefixes(lines: Array<string>, rows: number, minNumPad = 1, seperator = ' | '): [Array<string>, number] {
    const rowPad = Math.max(Math.ceil(Math.log10(rows + 1)), minNumPad);
    const padBase = (lines.length - 1) + rows;

    // Add row-numbers
    const newLines = lines.map((value, index) =>
        String(padBase + index).padStart(rowPad, '0') + seperator + value
    );

    return [newLines, rowPad + seperator.length];
}

/**
 * Resolves the past n-lines of the sources code
 * @param source The source code
 * @param max Maximum amount to parse
 * @param offset Optional offset
 * @return Tuple with array of lines and total amount of rows
 */
function resolvePastNLines(source: string, max = 10, offset = source.length): [Array<string>, number] {
    const lines: Array<string> = [];
    let buffer = '';
    let rows = 1;

    // Resolve lines
    const nextLineBreak = alternative(source.indexOf('\n', offset), source.length) - 1;
    for (let i = nextLineBreak; i >= 0; i--) {
        const char = source[i];

        if (char !== '\n') {
            buffer = char + buffer;
            continue;
        }

        if (lines.length < max) {
            lines.splice(0, 0, buffer);
            buffer = '';
        }

        rows++;
    }

    if (!lines.length) {
        lines.push(source);
    }

    // Strip leading whitespace
    const whitespace = /^[\s]*$/g;
    while (whitespace.exec(lines[0])) {
        lines.splice(0, 1);
    }

    return [lines, rows];
}


/**
 * Pretty-prints an error-message
 * @param msg the source-code
 * @param source error message
 * @param start error-offset
 * @param end error-end index
 */
export const prettifyError = (msg: string, source: string, start: number, end: number): string => {

    // Error cursor
    const col = (start - alternative(previousIndexOf(source, '\n', start), -1) + 1);

    // Add row-numbers
    const [sourceLines, rowCount] = resolvePastNLines(source, 4, end);
    const [lines, rowPad] = addLinePrefixes(sourceLines, rowCount, 2);

    // Push cursor and error-message
    lines.push(' '.repeat(col + rowPad) + '^'.repeat(end - start));
    lines.push(`Error: ${msg}`);

    return `\n${lines.join('\n')}`;
};
