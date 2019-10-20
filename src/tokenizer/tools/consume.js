module.exports = (stream, predicate) => {
    let result = '';

    while (stream.hasNext() && predicate(stream.peek())) {
        result += stream.next();
    }

    return result;
};
