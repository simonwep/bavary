import {Container, Modifiers, ModifierTarget} from '../../ast/types';

export const applyModifications = (res: ModifierTarget, decl: Container): void => {
    const {modifiers, value} = decl;
    const errorIntro = value.type === 'reference' ? `Reference ${value.value.join(':')}` : 'Anonymous reference';

    for (const ext of modifiers as Modifiers) {
        switch (ext.type) {
            case 'def': {
                res[ext.key] = ext.value;
                break;
            }
            case 'del': {
                if (typeof res[ext.param] === 'undefined') {
                    throw new Error(`${errorIntro} does not return the tag "${ext.param}"`);
                }

                delete res[ext.param];
            }
        }
    }
};
