import {Reference}             from '../../ast/types';
import {evalRawReference}      from '../internal';
import {NodeValue, StringNode} from '../node';
import {typeOf}                from '../tools/type-of';
import {ParserArgs}            from '../types';

export const evalReference = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<Reference>
): boolean => {

    // Resolve value of reference
    const matches = evalRawReference({
        config, stream, decl, scope
    });

    // Identify value type
    const matchesType = typeOf(matches);

    stream.stash();
    if (matches !== null) {
        if (matchesType === 'array') {

            // Join array-values if all entries are strings
            if (node instanceof StringNode && (matches as Array<NodeValue>).every(v => typeof v === 'string')) {
                node.value += (matches as Array<NodeValue>).join('');
            }

        } else if (matchesType === 'string' && node instanceof StringNode) {

            // Concat strings
            node.value += matches as string;
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
