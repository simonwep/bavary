const check = require('./check');

module.exports = (stream, type, ...vals) => {

    if (check(stream, type, ...vals)) {
        return stream.next();
    }

    return null;
};
