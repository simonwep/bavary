import {ReturnStatement} from '../../../ast/types';
import {evalLiteral}     from '../../tools/eval-literal';
import {ParserArgs}      from '../../types';

export const evalReturnCommand = (
    {decl, node}: ParserArgs<ReturnStatement>
): boolean => {
    const {value} = decl;

    switch (value.type) {
        case 'literal': {
            node.return(evalLiteral(node, value));
            break;
        }
        case 'member-expression': {
            node.return(node.lookup(value.value) || null);
            break;
        }
    }

    return true;
};
