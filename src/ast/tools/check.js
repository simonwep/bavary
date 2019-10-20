module.exports = (stream, type, ...vals) => {
    const peek = stream.type ? stream : stream.peek();

    // Check if type matches
    if (!peek || peek.type !== type) {
        return false;
    }

    // Check if value matches
    return !vals.length || vals.includes(peek.value);
};
