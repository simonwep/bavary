import {ValueAccessorPath} from '../../ast/types';
import {typeOf}            from './type-of';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const lookupValue = (source: any, path: ValueAccessorPath): unknown => {

    for (const ent of path) {
        const sourceType = typeOf(source);

        // I don't know why istanbul thinks the else-if isn't covered
        /* istanbul ignore else */
        if (typeof ent === 'string') {

            // Allow access to length propertie of strings and arrays
            if ((sourceType === 'array' || sourceType === 'string') && ent === 'length') {
                source = source.length;
                continue;
            }

            if (sourceType === 'object') {
                source = source[ent];

                if (source !== undefined) {
                    continue;
                }
            }

        } else if (sourceType === 'array' && ent < source.length) {
            source = source[ent];
            continue;
        }

        return null;
    }

    return source;
};
