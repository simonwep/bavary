import {expect}                                      from '../../tools/expect';
import {maybe}                                       from '../../tools/maybe';
import {optional}                                    from '../../tools/optional';
import {CharacterSelection, CharacterSelectionArray} from '../../types';
import {parseCharacterClass}                         from './character-class';
import {parseSequence}                               from './selection';

/**
 * Parses a character-selection. This can be a character-class or
 * written out one.
 */
module.exports = maybe<CharacterSelection>(stream => {
    const multiplier = require('../multiplier');

    // It may be a character class
    if (optional(stream, false, 'punc', ':')) {
        return parseCharacterClass(stream);
    } else if (!optional(stream, false, 'punc', '(')) {
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
        multiplier: multiplier(stream),
        included,
        excluded
    } as CharacterSelection;
});
