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
        result
    }: ParserArgs<PushStatement>
): boolean => {

    // Push only works on arrays
    if (result.type !== 'array') {
        throw new Error('Can\'t use define within arrays or strings.');
    }

    const {value} = decl;
    if (value.type === 'literal') {
        result.value.push(evalLiteral(result, value));
    } else {
        const res = evalGroup({
            decl: value,
            scope,
            config,
            stream
        });

        if (res) {
            result.value.push(res);
            return true;
        }

        return value.multiplier?.type === 'optional';
    }
    return true;
};
