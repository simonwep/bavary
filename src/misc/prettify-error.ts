import previousIndexOf from 'previous-index-of';

function alternative(val: number, fallback: number, pred = -1): number {
    return val === pred ? fallback : val;
}

/**
 * Pretty-prints an error-message
 * @param src the source-code
 * @param message error message
 * @param start error-offset
 * @param end error-end index
 */
export default (src: string, message: string, start: number, end: number): string => {
    const prevLineBreak = alternative(previousIndexOf(src, '\n', start), 0);
    const nextLineBreak = alternative(src.indexOf('\n', end), src.length);
    const col = (start - prevLineBreak);
    return `${src.slice(prevLineBreak, nextLineBreak)}\n${' '.repeat(col)}^\n${message}`;
};
