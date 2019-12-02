import {Modifiers, ModifierTarget, Reference} from '../../../ast/types';
import {def}                                  from './def';
import {del}                                  from './del';

export const applyModifications = (res: ModifierTarget, decl: Reference): void => {
    for (const ext of decl.modifiers as Modifiers) {
        switch (ext.type) {
            case 'def': {
                def(res, ext);
                break;
            }
            case 'del': {
                del(res, ext);
            }
        }
    }
};
