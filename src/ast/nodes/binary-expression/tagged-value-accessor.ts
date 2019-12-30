import {maybe}              from '../../tools/maybe';
import {ValueAccessor}      from '../../types';
import {parseTag}           from '../tag';
import {parseValueAccessor} from '../value-accessor';

export const taggedValueAccessor = maybe<ValueAccessor>(stream => {
    const tag = parseTag(stream);

    if (!tag) {
        return null;
    }

    return {
        type: 'value-accessor',
        value: [
            tag.value,
            ...(parseValueAccessor(stream)?.value || [])
        ]
    } as ValueAccessor;
});
