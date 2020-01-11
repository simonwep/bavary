import previousIndexOf from 'previous-index-of';

function alternative(val: number, fallback: number, pred = -1): number {
    return val === pred ? fallback : val;
}

/**
 * Pretty-prints an error-message
 * @param msg the source-code
 * @param source error message
 * @param start error-offset
 * @param end error-end index
 */
export const prettifyError = (msg: string, source: string, start: number, end: number): string => {
    const prevLineBreak = alternative(previousIndexOf(source, '\n', start), -1) + 1;
    const nextLineBreak = alternative(source.indexOf('\n', end), source.length);
    const col = (start - prevLineBreak);
    return `\n${source.slice(prevLineBreak, nextLineBreak)}\n${' '.repeat(col)}^\n${msg}`;
};
