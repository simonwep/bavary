import {Literal}     from '../../ast/types';
import {StringNode}  from '../node';
import {evalLiteral} from '../tools/eval-literal';
import {ParserArgs}  from '../types';

export const evalLiteralContent = (
    {
        stream,
        decl,
        node
    }: ParserArgs<Literal>
): boolean => {
    const value = evalLiteral(node, decl);

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    if (node instanceof StringNode) {
        node.value += value;
    }

    return true;
};
