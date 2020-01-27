import {ReturnStatement} from '../../../ast/types';
import {evalLiteral}     from '../../tools/eval-literal';
import {ParserArgs}      from '../../types';

export const evalReturnCommand = (
    {decl, node}: ParserArgs<ReturnStatement>
): boolean => {
    node.return(evalLiteral(node, decl.value));
    return true;
};
