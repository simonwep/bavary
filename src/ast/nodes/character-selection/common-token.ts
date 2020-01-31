import {TokenStream}             from '../../../tokenizer/token-stream';
import {maybe}                   from '../../tools/maybe';
import {CharacterSelectionArray} from '../../types';
import {commonTokens}            from './common-tokens';

export const parseCommonToken = maybe<CharacterSelectionArray>((stream: TokenStream) => {

    // The . character stands for anything
    if (stream.optional('punc', '.')) {
        return [[0, 65535]];
    } else if (!stream.optional('punc', '\\')) {
        return null;
    }

    const tv = stream.expect('kw');
    const target = commonTokens[tv];

    if (target === undefined) {
        stream.throw(`Unknown token: "${tv}"`);
    }

    return target;
});
