import {CustomFunctionUtils, ParsingResult} from '../types';

export const createCustomFunctionUtils = (res: ParsingResult): CustomFunctionUtils => ({
    state: res,

    setString(str): void {
        if (!res.pure) {
            throw new Error('Can\'t apply string, result isn\'t pure.');
        }

        res.str = str;
    },

    setProperty(key, val): void {
        res.obj[key] = val;
        res.pure = false;
    }
});
