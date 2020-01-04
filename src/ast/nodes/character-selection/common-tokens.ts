import {CharacterSelectionArray} from '../../types';

/**
 * Map of common tokens used in regular-expressions.
 */
export const commonTokens = {

    // Tab character
    't': [9],

    // Newline character
    'n': [10],

    // Carriage return
    'r': [13],

    // Null Character
    '0': [0],

    // Any whitespace character
    // [tab; newline; space]
    's': [9, 10, 32],

    // Any digit
    // [[0, 9]]
    'd': [[48, 57]],

    // Any word character
    // [[a, z]; [A, Z]; [0, 9]; _]
    'w': [[97, 122], [65, 90], [48, 57], 95]
} as {[key: string]: CharacterSelectionArray};
