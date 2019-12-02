import {DefineModifier, ModifierTarget} from '../../../ast/types';
import {lookupValue}                    from '../../tools/lookup-value';

export const def = (res: ModifierTarget, {value, key}: DefineModifier): void | never => {
    switch (value.type) {
        case 'string': {
            res[key] = value.value;
            break;
        }
        case 'value-accessor': {
            res[key] = lookupValue(res, value.value);
            break;
        }
    }
};
