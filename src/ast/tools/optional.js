const check = require('./check');

/**
 * Same as check but consumes the value
 * @param stream
 * @param type
 * @param vals
 * @returns {string|*|void|undefined|IteratorResult<any>|Promise<IteratorResult<any>>|null}
 */
module.exports = (stream, type, ...vals) => {

    if (check(stream, type, ...vals)) {
        return stream.next();
    }

    return null;
};
