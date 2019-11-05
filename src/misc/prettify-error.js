const previousIndexOf = require('previous-index-of');

/* eslint-disable no-console */
/**
 * Pretty-prints an error-message
 * @param src the source-code
 * @param message error message
 * @param start error-offset
 * @param end error-end index
 */
module.exports = (src, message, start, end) => {
    const prevLineBreak = alternative(previousIndexOf(src, '\n', start), 0);
    const nextLineBreak = alternative(src.indexOf('\n', end), src.length);
    const col = (start - prevLineBreak) - 1;
    return `${src.slice(prevLineBreak, nextLineBreak)}\n${' '.repeat(col)}^\n${message}`;
};

function alternative(val, fallback, pred = -1) {
    return val === pred ? fallback : val;
}
