export const isPunctuation = (c: string): boolean => c < '0' || c > 'z' || (c > '9' && c < 'A') || (c > 'Z' && c < 'a');
export const isNonWhitespace = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
export const isWhiteSpace = (c: string): boolean => c === '\t' || c === '\n' || c === ' ';
export const isNumeric = (c: string): boolean => c >= '0' && c <= '9';
