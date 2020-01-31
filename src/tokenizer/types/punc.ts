import {Streamable}         from '../../streams/streamable';
import {isPunctuation}      from '../tools/is';
import {Token, TokenParser} from '../types';

export const punc: TokenParser = (stream: Streamable<string>, tokens: Array<Token>): boolean => {

    /* istanbul ignore else */
    if (isPunctuation(stream.peek() as string)) {
        let value = stream.next();

        if (value === '\\' && isPunctuation(stream.peek() as string)) {
            value = stream.next();
        }

        tokens.push({
            type: 'punc',
            value,
            start: stream.index - 1,
            end: stream.index
        } as Token);

        return true;
    }

    return false;
};
