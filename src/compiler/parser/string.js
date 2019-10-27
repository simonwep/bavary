module.exports = (stream, {value}) => {
    if (!stream.hasNext()) {
        return null;
    }

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        if (next !== value[i]) {
            stream.pop();
            return null;
        }
    }

    stream.recycle();
    return value;
};
