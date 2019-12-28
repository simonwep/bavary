import {TokenStream}                                      from '../../../misc/token-stream';
import {parseIdentifier, parseString, parseValueAccessor} from '../../internal';
import {expect}                                           from '../../tools/expect';
import {skipWhitespace}                                   from '../../tools/skip-whitespace';
import {DefineModifier}                                   from '../../types';

export const parseDefineModifier = (stream: TokenStream): DefineModifier => {
    const key = parseIdentifier(stream);
    if (!key) {
        stream.throwError('Expected identifier');
    }

    expect(stream, false, 'punc', '=');
    skipWhitespace(stream);

    const val = parseString(stream) || parseValueAccessor(stream);
    if (!val) {
        stream.throwError('Expected string, function-call or value-accessor.');
    }

    return {
        type: 'def',
        value: val,
        key: key.value
    } as DefineModifier;
};
