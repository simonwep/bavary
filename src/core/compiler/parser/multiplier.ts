import {CharacterSelection, Group, MultiplierRange, Container} from '../../ast/types';
import Streamable                                              from '../../stream';
import {ParsingResult, Scope}                                  from '../types';

type typesWhoCouldHaveMultiplierAttachedToIt = Group | Container | CharacterSelection;

export default <result, declarationType extends typesWhoCouldHaveMultiplierAttachedToIt>(
    fn: (
        stream: Streamable<string>,
        decl: declarationType,
        scope: Scope,
        result: ParsingResult
    ) => result | null
) => {

    return (
        stream: Streamable<string>,
        decl: declarationType,
        scope: Scope,
        result: ParsingResult
    ): result | Array<result> | null => {
        const parse = (): result | null => fn(stream, decl, scope, result);
        const parseAll = (): Array<result> => {
            const values: Array<result> = [];

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
