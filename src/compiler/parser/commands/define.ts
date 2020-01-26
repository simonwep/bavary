import {DefineStatement} from '../../../ast/types';
import {NodeValue}       from '../../node';
import {evalLiteral}     from '../../tools/eval-literal';
import {ParserArgs}      from '../../types';
import {evalGroup}       from '../group';

export const evalDefineCommand = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<DefineStatement>
): boolean => {

    // Define only works on object-groups
    if (!(node.type === 'object')) {
        throw new Error('Can\'t use define within arrays or strings.');
    }

    const {value} = decl;
    if (value.type === 'literal') {
        node.value[decl.name] = evalLiteral(node, value);
    } else if (value.type === 'member-expression') {
        node.value[decl.name] = node.lookup(value.value) as NodeValue;
    } else {
        const res = evalGroup({
            decl: value,
            parent: node,
            scope,
            config,
            stream
        });

        if (res !== null) {
            node.value[decl.name] = res;
        } else {
            return value.multiplier?.type === 'optional';
        }
    }

    return true;
};
