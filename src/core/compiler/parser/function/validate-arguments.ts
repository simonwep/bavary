import {Func} from '../../../ast/types';

// TODO: Reduce general usage of default export
export const validateArguments = (func: Func, ...types: Array<Array<string> | string>): void | never => {
    const {args, name} = func;

    if (args.length > types.length) {
        throw new Error(`Too many arguments for ${name}. Expected maximally ${types.length}`);
    }

    for (let i = 0; i < args.length && i < types.length; i++) {
        const typeSet = types[i];
        const actual = args[i].type;

        if (Array.isArray(typeSet)) {
            if (!typeSet.includes(actual)) {
                throw new Error(`Arguments mismatch for ${name}: Expected one of [${typeSet.join(', ')}] at position ${i + 1} but got "${actual}".`);
            }
        } else if (typeSet !== actual) {
            throw new Error(`Arguments mismatch for ${name}: Expected "${typeSet} at position ${i + 1} but got "${actual}".`);
        }
    }
};
