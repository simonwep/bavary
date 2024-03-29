import {Literal}     from '../../ast/types';
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

        // Check for type mismatch
        if (!stream.hasNext() || stream.next() !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    if (node.type === 'string') {
        node.value += value;
    }

    return true;
};
