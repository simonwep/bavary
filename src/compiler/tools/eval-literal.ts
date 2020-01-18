import {Literal}       from '../../ast/types';
import {ParsingResult} from '../types';
import {lookupValue}   from './lookup-value';

export const evalLiteral = (result: ParsingResult, decl: Literal): string => {
    const {value} = decl;
    let str = '';

    for (const part of value) {
        let raw = null;

        // Resolve value
        switch (part.type) {
            case 'value-accessor': {
                raw = lookupValue(result.value, part.value);

                // Ignore null or undefined values
                if (raw === null || raw === undefined) {
                    break;
                }

                // Strict-check if it's not a string or number
                if (typeof raw !== 'string' && typeof raw !== 'number') {
                    throw new Error(`Evaluated value of "${part.value.pop()}" not a string or number.`);
                }

                break;
            }
            case 'literal': {
                raw = evalLiteral(result, part);
                break;
            }
            case 'string-litereal': {
                raw = part.value;
            }
        }

        str += raw || '';
    }

    return str;
};
