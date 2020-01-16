import {Literal}     from '../../ast/types';
import {evalGroup}   from '../internal';
import {ParserArgs}  from '../types';
import {lookupValue} from './lookup-value';

export const evalLiteral = (
    {
        stream,
        config,
        scope,
        decl,
        result
    }: ParserArgs<Literal>
): string => {
    const {value} = decl;
    let str = '';

    for (const part of value) {
        let raw = null;

        // Resolve value
        switch (part.type) {
            case 'group': {
                raw = evalGroup({
                    result,
                    stream,
                    config,
                    scope,
                    decl: part
                });

                // Unexpected group value
                if (typeof value === 'object') {
                    throw new Error('Group in literal does not return a string.');
                }

                break;
            }
            case 'value-accessor': {
                raw = lookupValue(result.value, part.value);
                break;
            }
            case 'raw-literal': {
                raw = part.value;
                break;
            }
            case 'literal': {
                raw = evalLiteral({
                    result,
                    stream,
                    config,
                    scope,
                    decl: part
                });
            }
        }

        str += raw || '';
    }

    return str;
};
