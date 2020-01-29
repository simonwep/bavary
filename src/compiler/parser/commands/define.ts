import {DefineStatement, UseStatement} from '../../../ast/types';
import {evalLiteral}                   from '../../tools/eval-literal';
import {ParserArgs}                    from '../../types';
import {evalGroup}                     from '../group';
import {evalRawReference}              from '../resolve-reference';

export const evalDefineCommand = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<UseStatement | DefineStatement>
): boolean => {

    // Define only works on object-groups
    if (!(node.type === 'object')) {
        throw new Error('Can\'t use define within arrays or strings.');
    }

    const {value} = decl;
    switch (value.type) {
        case 'group': {
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
            break;
        }
        case 'reference': {
            node.value[decl.name] = evalRawReference({
                decl: value,
                scope,
                config,
                stream
            });
            break;
        }
        case 'literal': {
            node.value[decl.name] = evalLiteral(node, value);
            break;
        }
        case 'member-expression': {
            node.value[decl.name] = node.lookup(value.value) || null;
        }
    }

    return true;
};
