import {TokenStream}                   from '../../tokenizer/token-stream';
import {
    parseCharacterSelecton,
    parseConditionalStatement,
    parseFunction,
    parseGroupStatement,
    parseLiteral,
    parseMultiplier,
    parseReference
}                                      from '../internal';
import {combine}                       from '../tools/combine';
import {maybe}                         from '../tools/maybe';
import {Combinator, Group, GroupValue} from '../types';
import {parseSpread}                   from './spread';

export const parseCombinator = maybe<string>((stream: TokenStream) => {
    let combinator = stream.optional('punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator === '&' && stream.optional('punc', '&')) {
        combinator += '&';
    }

    return combinator;
});

export const parseGroup = maybe<Group>((stream: TokenStream) => {

    // It may be a group
    if (!stream.optional('punc', '[')) {
        return null;
    }

    stream.stash();
    const mode = stream.optional('kw', 'object', 'array', 'string');
    if (mode) {
        stream.expect('punc', ':');
    }

    stream.recycle();
    const values: Array<GroupValue> = [];
    const parsers = combine<GroupValue | null>(
        parseSpread,
        parseGroupStatement,
        parseConditionalStatement,
        parseFunction,
        parseGroup,
        parseReference,
        parseCharacterSelecton,
        parseLiteral
    );

    // The following code is chaos, and thats ok.
    // It works as intended and does the job just fine.
    let comg: null | Combinator = null;
    while (!stream.match('punc', ']')) {
        const value = parsers(stream);
        const sign = parseCombinator(stream);

        if (!value) {
            stream.throw('Expected a type, group or raw string / character-range.');
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
                    } as Combinator;

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
            } as Combinator;

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
        stream.throw('Combinator is missing a value!');
    }

    stream.expect('punc', ']');

    return {
        type: 'group',
        mode,
        multiplier: parseMultiplier(stream),
        value: values
    } as Group;
});
