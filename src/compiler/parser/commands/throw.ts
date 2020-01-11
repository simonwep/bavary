import {ThrowStatement} from '../../../ast/types';
import {ParserArgs}     from '../../types';

export const evalThrowStatement = (
    {
        stream,
        decl
    }: ParserArgs<ThrowStatement>
): void | never => {

    // Make stream throw an error, it's pretty - I promise.
    stream.throw(decl.value.value);
};
