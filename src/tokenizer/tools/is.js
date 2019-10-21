module.exports = {
    isPunctuation: c => c < '0' || c > 'z' || (c > '9' && c < 'A') || (c > 'Z' && c < 'a'),
    isNonWhitespace: c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_',
    isWhiteSpace: c => c === '\t' || c === '\n' || c === ' ',
    isNumeric: c => c >= '0' && c <= '9'
};
