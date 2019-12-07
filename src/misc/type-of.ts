export type Type = 'array' | 'object' | 'string' | 'number' | 'null' | 'undefined' | 'boolean' | 'symbol' | 'function' | 'bigint';
export const typeOf = (val: unknown): Type => {
    const typeOfRes = typeof val;

    if (typeOfRes === 'object') {
        return Array.isArray(val) ? 'array' : 'object';
    }

    return typeOfRes;
};
