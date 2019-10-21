const createStream = require('../stream');
const consume = require('./tools/consume');
const {isWhiteSpace} = require('./tools/is');

const parser = [
    require('./types/str'),
    require('./types/kw'),
    require('./types/num'),
    require('./types/punc')
];

/**
 * Parses a sequence of characters into a list of processable tokens
 * @param str
 * @returns {[]}
 */
module.exports = str => {
    const stream = createStream(str);
    const tokens = [];

    /* eslint-disable no-labels */
    outer: while (stream.hasNext()) {

        // Ignore whitespace
        consume(stream, isWhiteSpace);

        if (!stream.hasNext()) {
            break;
        }

        // Find matching parser
        for (const parse of parser) {
            const start = stream.index;
            const parsed = parse(stream);

            if (!parsed) {
                continue;
            }

            // Check if token could be the beginning of a comment
            if (parsed.value === '/' && stream.hasNext() && stream.peek() === '/') {
                while (stream.hasNext()) {
                    if (stream.peek() === '\n') {
                        break;
                    }

                    stream.next();
                }

                continue outer;
            }

            tokens.push({
                ...parsed, start,
                end: stream.index
            });

            continue outer;
        }

        throw 'Failed to parse input sequence.';
    }

    return tokens;
};
