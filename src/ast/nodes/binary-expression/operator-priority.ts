export const operatorPriority = {
    '|': 1,
    '&': 2,
    '=': 3,
    '!': 3,
    '<': 4,
    '>': 4
} as {[key: string]: number};

export const operators = Object.keys(operatorPriority);
