import {ThrowStatement} from '../../../ast/types';
import {evalLiteral}    from '../../tools/eval-literal';
import {ParserArgs}     from '../../types';

export const evalThrowStatement = (args: ParserArgs<ThrowStatement>): void | never => {

    // Make stream throw an error, it's pretty - I promise.
    args.stream.throw(evalLiteral({
        ...args,
        decl: args.decl.value
    }));
};
