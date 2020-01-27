import {ThrowStatement} from '../../../ast/types';
import {evalLiteral}    from '../../tools/eval-literal';
import {ParserArgs}     from '../../types';

export const evalThrowCommand = (
    {
        stream,
        node,
        decl
    }: ParserArgs<ThrowStatement>
): void | never => {

    // Make stream throw an error, it's pretty - I promise.
    stream.throw(evalLiteral(node, decl.value));
};
