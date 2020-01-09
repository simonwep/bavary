import {Reference}                      from '../../ast/types';
import {evalRawReference}               from '../internal';
import {typeOf}                         from '../tools/type-of';
import {ParserArgs, ParsingResultValue} from '../types';

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

            // Validate both sides
            if (matchesType === 'string') {
                throw new Error(`"${decl.value}" doesn't return a object or array which is required for the spread operator to work.`);
            } else if (result.type === 'string') {
                throw new Error('Cannot use spread-operator in strings.');
            }

            /**
             * Join objects / arrays. Otherwise throw error because of incompatibility
             */
            if (matchesType === 'array' && result.type === 'array') {
                result.value.push(...(matches as Array<ParsingResultValue>));
            } else if (matchesType === 'object' && result.type === 'object') {
                Object.assign(result.value, matches);
            } else {
                throw new Error(`Incompatible types used in spread operator: ${matchesType} ≠ ${result.type}`);
            }

        } else if (matchesType === 'array') {

            // Join array-values if all entries are strings
            if (result.type === 'string' && (matches as Array<ParsingResultValue>).every(v => typeof v === 'string')) {
                result.value += (matches as Array<ParsingResultValue>).join('');
            }

        } else if (matchesType === 'string' && result.type === 'string') {

            // Concat strings
            result.value += matches;
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
