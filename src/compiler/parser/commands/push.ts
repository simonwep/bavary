import {PushStatement} from '../../../ast/types';
import {evalLiteral}   from '../../tools/eval-literal';
import {ParserArgs}    from '../../types';
import {evalGroup}     from '../group';

export const evalPushCommand = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<PushStatement>
): boolean => {

    // Push only works on arrays
    if (!(node.type === 'array')) {
        throw new Error('Can\'t use define within arrays or strings.');
    }

    const {value} = decl;
    if (value.type === 'literal') {
        node.value.push(evalLiteral(node, value));
    } else {
        const res = evalGroup({
            decl: value,
            scope,
            config,
            stream
        });

        if (res) {
            node.value.push(res);
            return true;
        }

        return value.multiplier?.type === 'optional';
    }
    return true;
};
