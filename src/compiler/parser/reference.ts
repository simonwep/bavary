import {Reference}                            from '../../ast/types';
import {evalRawReference}                     from '../internal';
import {typeOf}                               from '../tools/type-of';
import {ParserArgs, ParsingResultObjectValue} from '../types';

export const evalReference = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): boolean => {

    // Resolve value of reference
    const matches = evalRawReference({config, stream, decl, scope, result});

    // Identify result type
    const matchesType = typeOf(matches);

    stream.stash();
    if (matches !== null) {

        if (decl.spread) {

            // Spread operator won't work with strings or arrays
            if (matchesType !== 'object') {
                throw new Error(`"${decl.value}" doesn't return a object which is required for the spread operator to work.`);
            } else if (result.type !== 'object') {

                // TODO: Weird error message though
                throw new Error('Spread operator can only be used within objects.');
            }

            // Assign result to current object
            Object.assign(result.value, matches);
        } else if (matchesType === 'array') {

            if (result.type === 'string' && (matches as Array<unknown>).every(v => typeof v === 'string')) {
                result.value += (matches as Array<unknown>).join('');
            } else if (result.type === 'array') {
                result.value.push(...(matches as Array<ParsingResultObjectValue>));
            } else {
                // TODO: What happens in this case?
            }

        } else if (matchesType === 'string') {
            if (result.type === 'string') {
                result.value += matches;
            } else if (result.type === 'array') {
                result.value.push(matches);
            }
        } // TODO: Throw error if nothing happens?
    } else {

        // Restore previous stack position
        stream.pop();

        // Declaration may be still optional through a '?'
        return !!(decl.multiplier && decl.multiplier.type === 'optional');
    }

    stream.recycle();
    return true;
};
