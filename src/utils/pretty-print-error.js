const previousIndexOf = require('previous-index-of');
const MAX_LOOKBACK = 10;

/* eslint-disable no-console */
/**
 * Pretty-prints an error-message
 * @param src the source-code
 * @param message error message
 * @param start error-offset
 * @param end error-end index
 */
module.exports = (src, {message, start, end}) => {
    const prevLineBreak = alternative(previousIndexOf(src, '\n', start), 0);
    const nextLineBreak = alternative(src.indexOf('\n', end), src.length);
    const sourceLines = resolveSourceLines(src, nextLineBreak);
    const col = (start - prevLineBreak);

    const totalLines = countLines(src);
    const totalLinesMaxStrLength = Math.max(String(totalLines).length, 2);

    // Check if lines where omitted
    const omittedLines = totalLines - sourceLines.length + 1;
    if (omittedLines > 1) {
        console.log(`${omittedLines} line${omittedLines === 1 ? '' : 's'} omitted...`);
    }

    // Pretty-print lines
    // TODO: Omit empty, trailing lines?
    for (let i = 0; i < sourceLines.length; i++) {
        const line = sourceLines[i];
        const lineOffset = totalLines - sourceLines.length + i + 2;
        const lineCount = String(lineOffset).padStart(totalLinesMaxStrLength, '0');
        console.log(`${lineCount} ${line}`);
    }

    console.log(`${' '.repeat(col + totalLinesMaxStrLength)}^`);
    console.error(message);
};

function trimLine(line) {
    return line.replace(/^[\n\r]+|[\n\r ]+$/g, '');
}

function countLines(src) {
    let count = 0;

    for (const ch of src) {
        count += ch === '\n' ? 1 : 0;
    }

    return count;
}

function resolveSourceLines(src, end) {
    const lines = [];

    let prevIndex = end;
    while (lines.length < MAX_LOOKBACK) {
        const nextIndex = previousIndexOf(src, '\n', prevIndex - 1);

        if (~nextIndex) {
            const line = src.substring(nextIndex, prevIndex);
            lines.splice(0, 0, trimLine(line));
            prevIndex = nextIndex;
        } else {
            break;
        }
    }

    if (!lines.length && src.length) {
        lines.push(trimLine(src));
    }

    return lines;
}

function alternative(val, fallback, pred = -1) {
    return val === pred ? fallback : val;
}
