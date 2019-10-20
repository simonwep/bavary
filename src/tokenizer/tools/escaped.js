module.exports = (stream, end) => {
    let escaped = false;
    let str = '';

    for (let ch = stream.next(); ; ch = stream.next()) {
        if (escaped) {
            str += ch;
            escaped = false;
        } else if (ch === '\\') {
            escaped = true;
        } else if (ch === end) {
            return str;
        } else if (!stream.hasNext()) {
            break;
        } else {
            str += ch;
        }
    }

    return null;
};
