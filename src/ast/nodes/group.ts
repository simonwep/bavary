import {TokenStream}                                                                                                                  from '../../tokenizer/stream/token-stream';
import {parseCharacterSelecton, parseConditionalStatement, parseFunction, parseIgnored, parseMultiplier, parseReference, parseString} from '../internal';
import {parseCombinator}                                                                                                              from '../modifiers/combinator';
import {combine}                                                                                                                      from '../tools/combine';
import {maybe}                                                                                                                        from '../tools/maybe';
import {BinaryCombinator, Group, GroupValue}                                                                                          from '../types';

export const parseGroup = maybe<Group>((stream: TokenStream) => {

    // It may be a group
    if (!stream.optional(false, 'punc', '[')) {
        return null;
    }

    const values: Array<GroupValue> = [];
    const parsers = combine<GroupValue | null>(
        parseConditionalStatement,
        parseFunction,
        parseIgnored,
        parseGroup,
        parseReference,
        parseCharacterSelecton,
        parseString
    );

    // The following code is chaos, and thats ok.
    // It works as intended and does the job just fine.
    let comg: null | BinaryCombinator = null;
    while (!stream.match(false, 'punc', ']')) {
        const value = parsers(stream);
        const sign = parseCombinator(stream);

        if (!value) {
            stream.throwError('Expected a type, group or raw string / character-range.');
        }

        if (sign) {

            // Append to previous group
            if (comg) {
                if (sign === comg.sign) {

                    // Still the same binary combinator since the sign is the same
                    comg.value.push(value);
                } else {

                    /**
                     * Different sign, create new combinator with new sign and push it to
                     * previous combinator
                     */
                    const subCom = {
                        type: 'combinator',
                        value: [value],
                        sign
                    } as BinaryCombinator;

                    comg.value.push(subCom);
                    comg = subCom; // We're now in another combinator
                }

                continue;
            }

            // No combinator defined, create one with current sign
            comg = {
                type: 'combinator',
                value: [value],
                sign
            } as BinaryCombinator;

            values.push(comg);
        } else if (comg) {

            // Last element of combinator, push it and set current combinator back to null
            comg.value.push(value);
            comg = null;
        } else {

            // Element does no correspond to any binary combinator
            values.push(value);
        }
    }

    // A remaining
    if (comg) {
        stream.throwError('Combinator is missing a value!');
    }

    stream.expect(false, 'punc', ']');

    return {
        type: 'group',
        multiplier: parseMultiplier(stream),
        value: values
    } as Group;
});
