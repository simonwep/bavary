import {CharacterSelection, Group, MultiplierRange, Reference} from '../../ast/types';
import {Streamable}                                            from '../../streams/streamable';

type PossibleStatements = Group | Reference | CharacterSelection;

type RequiredParserArgs<T> = {
    stream: Streamable<string>;
    decl: T;
};

export const multiplier = <ExpectedResult, DeclarationType extends PossibleStatements>(
    fn: (args: RequiredParserArgs<DeclarationType>) => ExpectedResult | null
) => (args: RequiredParserArgs<DeclarationType>): Array<ExpectedResult> | ExpectedResult | null => {
        const {stream, decl} = args;

        const parseAll = (): Array<ExpectedResult> => {
            const values: Array<ExpectedResult> = [];

            for (let res; (res = fn(args));) {
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

                    if (values.length < start || (end !== null && values.length > end)) {
                        stream.pop();
                        return null;
                    }

                    stream.recycle();
                    return values;
                }
            }
        }

        stream.recycle();
        return fn(args);
    };
