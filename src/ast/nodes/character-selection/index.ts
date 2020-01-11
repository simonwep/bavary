import {TokenStream}                                 from '../../../tokenizer/token-stream';
import {parseMultiplier}                             from '../../internal';
import {maybe}                                       from '../../tools/maybe';
import {CharacterSelection, CharacterSelectionArray} from '../../types';
import {parseSequence}                               from './sequence';

export const parseCharacterSelecton = maybe<CharacterSelection>((stream: TokenStream) => {
    if (!stream.optional(false, 'punc', '(')) {
        return null;
    }

    const included: CharacterSelectionArray = [];
    const excluded: CharacterSelectionArray = [];
    included.push(...parseSequence(stream));

    if (stream.optional(false, 'kw', 'except')) {
        excluded.push(...parseSequence(stream));
    }

    stream.expect(false, 'punc', ')');
    return {
        type: 'character-selection',
        multiplier: parseMultiplier(stream),
        included,
        excluded
    } as CharacterSelection;
});
