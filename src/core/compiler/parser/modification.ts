import {Modifiers, ModifierTarget, Reference} from '../../ast/types';

export const applyModifications = (res: ModifierTarget, decl: Reference): void => {
    const {modifiers, value} = decl;

    for (const ext of modifiers as Modifiers) {
        switch (ext.type) {
            case 'def': {
                res[ext.key] = ext.value;
                break;
            }
            case 'del': {
                if (typeof res[ext.param] === 'undefined') {
                    throw new Error(`${value.join(':')} does not return the tag "${ext.param}"`);
                }

                delete res[ext.param];
            }
        }
    }
};
