import {TokenStream}                                 from '../../../misc/token-stream';
import {expect}                                      from '../../tools/expect';
import {CharacterSelection, CharacterSelectionArray} from '../../types';
import {characterClasses}                            from './character-classes';

export const parseCharacterClass = (stream: TokenStream): CharacterSelection => {
    const indentifier = require('../identifier');

    const kw = indentifier(stream)?.value;
    if (!kw) {
        stream.throwError('Expected class name.');
    }

    // Inject character-selection
    let excluded: CharacterSelectionArray = [];
    let included: CharacterSelectionArray = [];
    if (kw in characterClasses) {
        ({excluded = [], included = []} = characterClasses[kw] as {
            included?: CharacterSelectionArray;
            excluded?: CharacterSelectionArray;
        });
    } else {
        stream.throwError(`Unknown character class: "${kw}"`);
    }

    expect(stream, false, 'punc', ':');
    return {
        type: 'character-selection',
        multiplier: null,
        excluded,
        included
    } as CharacterSelection;
};
