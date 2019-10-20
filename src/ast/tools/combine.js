module.exports = (...parsers) => stream => {
    for (const parser of parsers) {
        const result = parser(stream);

        if (result) {
            return result;
        }
    }

    return null;
};
