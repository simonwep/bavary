import {ReturnStatement}      from '../../../ast/types';
import {NodeValue}            from '../../node';
import {evalLiteral}          from '../../tools/eval-literal';
import {evalMemberExpression} from '../../tools/eval-member-expression';
import {ParserArgs}           from '../../types';

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
            node.return((evalMemberExpression(node.value, value.value) as NodeValue) || null);
            break;
        }
    }

    return true;
};
