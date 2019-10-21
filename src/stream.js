const ParsingError = require('./misc/parsing-error.js');

module.exports = vals => {
    const stashed = [];
    let index = 0;

    return {
        stash: () => stashed.push(index),
        pop: () => index = stashed.pop(),
        next: () => vals[index++],
        peek: () => vals[index],
        hasNext: () => index < vals.length,
        recycle: () => stashed.pop(),

        /**
         * Throws an ParsingError
         * @param msg
         */
        throwError(msg) {
            if (index < vals.length) {
                const peek = vals[index];
                throw new ParsingError(msg, peek.start, peek.end);
            } else {
                throw new ParsingError(msg, index, index);
            }
        },

        get index() {
            return index;
        }
    };
};
