import {Str}                       from '../../ast/types';
import {ParserArgs, ParsingResult} from '../types';

export const evalString = (
    {stream, decl, result}: ParserArgs<Str>
): boolean => {
    const {value} = decl;

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    (result as ParsingResult).str += value;
    return true;
};
