import {ValueAccessorPath} from '../../ast/types';
import {typeOf}            from './type-of';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const lookupValue = (source: any, path: ValueAccessorPath): unknown => {

    for (const ent of path) {
        const sourceType = typeOf(source);

        // Allow access to length propertie of strings and arrays
        if ((sourceType === 'array' || sourceType === 'string') && ent === 'length') {
            source = source.length;
            continue;
        }

        if (typeof ent === 'string') {
            if (typeof source === 'object' && source !== null) {
                source = source[ent];

                if (source !== undefined) {
                    continue;
                }
            }
        } else if (Array.isArray(source) && ent < source.length) {
            source = source[ent];
            continue;
        }

        return null;
    }

    return source;
};
