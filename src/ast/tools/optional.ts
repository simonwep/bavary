import Streamable         from '../../stream';
import {Token, TokenType} from '../../tokenizer';
import check              from './check';

/**
 * Same as check but consumes the value
 * @param stream
 * @param type
 * @param vals
 */
export default (stream: Streamable<Token>, type: TokenType, ...vals): Token | null => {

    if (check(stream, type, ...vals)) {
        return stream.next();
    }

    return null;
};
