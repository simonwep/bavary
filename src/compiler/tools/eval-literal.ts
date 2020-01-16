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
                break;
            }
            case 'raw-literal': {
                raw = part.value;
                break;
            }
        }

        str += raw || '';
    }

    return str;
};
