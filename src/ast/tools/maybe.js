module.exports = fn => (stream, ...args) => {
    stream.stash();

    const result = fn(stream, ...args);
    if (result !== null) {
        stream.recycle();
        return result;
    }

    stream.pop();
    return null;
};
