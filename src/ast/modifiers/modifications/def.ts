import {TokenStream}                                      from '../../../tokenizer/stream/token-stream';
import {parseIdentifier, parseString, parseValueAccessor} from '../../internal';
import {DefineModifier}                                   from '../../types';

export const parseDefineModifier = (stream: TokenStream): DefineModifier => {
    const key = parseIdentifier(stream);
    if (!key) {
        stream.throwError('Expected identifier');
    }

    stream.expect(false, 'punc', '=');
    stream.consumeSpace();

    const value = parseString(stream) || parseValueAccessor(stream);
    if (!value) {
        stream.throwError('Expected string, function-call or value-accessor.');
    }

    return {
        type: 'def',
        key: key.value,
        value
    } as DefineModifier;
};
