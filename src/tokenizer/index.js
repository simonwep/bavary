const createStream = require('../stream');
const consume = require('./tools/consume');
const {isWhiteSpace} = require('./tools/is');

const parser = [
    require('./types/str'),
    require('./types/kw'),
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
        if (stream.hasNext()) {

            // Find matching parser
            for (const parse of parser) {
                const start = stream.index;
                const parsed = parse(stream);

                if (parsed) {
                    const end = stream.index;

                    tokens.push({
                        ...parsed,
                        start, end
                    });

                    continue outer;
                }
            }
        } else {
            break;
        }

        throw 'Failed to parse input sequence.';
    }

    return tokens;
};
