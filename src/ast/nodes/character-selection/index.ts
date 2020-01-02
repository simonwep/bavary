import {parseMultiplier}                             from '../../internal';
import {expect}                                      from '../../tools/expect';
import {maybe}                                       from '../../tools/maybe';
import {optional}                                    from '../../tools/optional';
import {CharacterSelection, CharacterSelectionArray} from '../../types';
import {parseSequence}                               from './sequence';

export const parseCharacterSelecton = maybe<CharacterSelection>(stream => {
    if (!optional(stream, false, 'punc', '(')) {
        return null;
    }

    const included: CharacterSelectionArray = [];
    const excluded: CharacterSelectionArray = [];
    included.push(...parseSequence(stream));

    if (optional(stream, false, 'kw', 'except')) {
        excluded.push(...parseSequence(stream));
    }

    expect(stream, false, 'punc', ')');
    return {
        type: 'character-selection',
        multiplier: parseMultiplier(stream),
        included,
        excluded
    } as CharacterSelection;
});
