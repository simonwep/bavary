import {CharacterSelection, Group, MultiplierRange, Reference} from '../../ast/types';
import Streamable                                              from '../../stream';
import {ParsingResult, Scope}                                  from '../types';

type typesWhoCouldHaveMultiplierAttachedToIt = Group | Reference | CharacterSelection;

export default <expectedResult, declarationType extends typesWhoCouldHaveMultiplierAttachedToIt>(
    fn: (
        stream: Streamable<string>,
        decl: declarationType,
        scope: Scope,
        result: ParsingResult
    ) => expectedResult | null
) => {

    return (
        stream: Streamable<string>,
        decl: declarationType,
        scope: Scope,
        result: ParsingResult
    ): expectedResult | Array<expectedResult> | null => {

        const parse = (): expectedResult | null => fn(stream, decl, scope, result);
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
}
