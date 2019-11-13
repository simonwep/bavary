import previousIndexOf from 'previous-index-of';

function alternative(val: number, fallback: number, pred = -1): number {
    return val === pred ? fallback : val;
}

/**
 * Pretty-prints an error-message
 * TODO: Cursor is misplaced
 * @param msg the source-code
 * @param source error message
 * @param start error-offset
 * @param end error-end index
 */
export default (msg: string, source: string, start: number, end: number): string => {
    const prevLineBreak = alternative(previousIndexOf(msg, '\n', start), 0);
    const nextLineBreak = alternative(msg.indexOf('\n', end), msg.length);
    const col = (start - prevLineBreak);
    return `${msg.slice(prevLineBreak, nextLineBreak)}\n${' '.repeat(col)}^\n${source}`;
};
