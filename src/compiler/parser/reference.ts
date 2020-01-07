import {Reference}                                           from '../../ast/types';
import {evalRawReference}                                    from '../internal';
import {typeOf}                                              from '../tools/type-of';
import {LocationDataObject, ParserArgs, ParsingResultObject} from '../types';

export const evalReference = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): boolean => {

    // Type may have a multiplier attached to it
    const starts = stream.index;
    const matches = evalRawReference({config, stream, decl, scope, result});

    // Identify result type
    const matchesType = typeOf(matches);

    // If reference has a tag, immediatly attach result
    if (decl.tag) {
        const tagValue = result.obj[decl.tag];

        if (tagValue !== undefined && tagValue !== null) {
            throw new Error(`Tag "${decl.tag}" is already defined (Contains "${tagValue}").\nYou may used it multiple times or within a group + multipliers, you should avoid that.`);
        }

        result.obj[decl.tag] = matches;
    }

    stream.stash();
    if (matches !== null) {

        // Save optional start / end labels
        if (config.locationData && matchesType === 'object') {
            const {end, start} = config.locationData as LocationDataObject;
            (matches as ParsingResultObject)[start] = starts;
            (matches as ParsingResultObject)[end] = stream.index - 1;
        }

        if (decl.spread) {

            // Spread operator won't work with strings or arrays
            if (matchesType !== 'object') {
                throw new Error(`"${decl.value}" doesn't return a object which is required for the spread operator to work.`);
            }

            // Assign result to current object
            Object.assign(result.obj, matches);
            result.pure = false;
        } else if (decl.tag) {

            // Since something was matched the result is not anymore "just a string"
            result.pure = false;

            // Perform appropriate action
        } else if (matchesType === 'array' && (matches as Array<unknown>).every(v => typeof v === 'string')) {
            result.str += (matches as Array<unknown>).join(''); // Concat string sequences
        } else if (matchesType === 'string') {
            result.str += matches as string;
        } else {
            throw new Error(`Type "${decl.value}" is missing a tag.`);
        }
    } else {

        // Restore previous stack position
        stream.pop();

        // Declaration may be still optional through a '?'
        return !!(decl.multiplier && decl.multiplier.type === 'optional');
    }

    stream.recycle();
    return true;
};
