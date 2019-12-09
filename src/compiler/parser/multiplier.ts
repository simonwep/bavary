import {CharacterSelection, Group, MultiplierRange, Reference} from '../../ast/types';
import {ParserArgs}                                            from '../types';

type typesWhoCouldHaveMultiplierAttachedToIt = Group | Reference | CharacterSelection;

export const maybeMultiplier = <expectedResult, declarationType extends typesWhoCouldHaveMultiplierAttachedToIt>(
    fn: (args: ParserArgs<declarationType>) => expectedResult | null
) => {

    return (args: ParserArgs<declarationType>): expectedResult | Array<expectedResult> | null => {
        const {stream, decl} = args;

        const parse = (): expectedResult | null => fn(args);
        const parseAll = (): Array<expectedResult> => {
            const values: Array<expectedResult> = [];

            // TODO: Smth fishy here with result
            for (let res; (res = parse());) {
                values.push(res);
            }

            return values;
        };

        // Check if there's a multiplier
        stream.stash();
        if (decl.multiplier) {
            const {type, value} = decl.multiplier;

            switch (type) {
                case 'zero-infinity': {
                    stream.recycle();
                    return parseAll();
                }
                case 'one-infinity': {
                    const values = parseAll();

                    if (!values.length) {
                        stream.pop();
                        return null;
                    }

                    stream.recycle();
                    return values;
                }
                case 'range': {
                    const {start, end} = value as MultiplierRange;
                    const values = parseAll();

                    if (values.length < start || (~end && values.length > end)) {
                        stream.pop();
                        return null;
                    }

                    stream.recycle();
                    return values;
                }
            }
        }

        stream.recycle();
        return parse();
    };
};