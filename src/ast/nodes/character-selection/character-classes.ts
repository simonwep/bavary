// Lowercase letters
const lower = {
    included: [[97, 122]]
};

// Uppercase letters
const upper = {
    included: [[65, 90]]
};

// Letters
const alpha = {
    included: [...lower.included, ...upper.included]
};

// Digits (0 - 9)
const digits = {
    included: [[48, 57]]
};

// Letters and digits
const alnum = {
    included: [...alpha.included, ...digits.included]
};

// All ascii characters
const ascii = {
    included: [[0, 127]]
};

// Space and tab
const blank = {
    included: [32, 9]
};

// Hex-characters
const xdigit = {
    included: [...digits.included, [97, 102], [65, 70]]
};

export const characterClasses: {[key: string]: object} = {
    lower,
    upper,
    alpha,
    digits,
    alnum,
    ascii,
    blank,
    xdigit
};

