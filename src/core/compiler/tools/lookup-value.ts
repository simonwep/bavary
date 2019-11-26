import {ValueAccessorPath} from '../../ast/types';

// TODO: Remove remaining default exports
/* eslint-disable @typescript-eslint/no-explicit-any */
export const lookupValue = (source: any, path: ValueAccessorPath): unknown => {

    for (const ent of path) {
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
