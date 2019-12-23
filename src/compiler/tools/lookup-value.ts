import {ValueAccessorPath} from '../../ast/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const lookupValue = (source: any, path: ValueAccessorPath): unknown => {

    for (const ent of path) {
        if (typeof ent === 'string') {

            // TODO: Support .length on arrays and strings?
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
