import {Modifiers, ModifierTarget, Reference} from '../../ast/types';
import {lookupValue}         from '../tools/lookup-value';
import {typeOf}              from '../../misc/type-of';
import {ParsingResultObject} from '../types';

export const applyModifications = (res: ModifierTarget, decl: Reference): void => {
    for (const ext of decl.modifiers as Modifiers) {
        switch (ext.type) {
            case 'def': {
                const extValue = ext.value;

                res[ext.key] = extValue.type === 'string' ?
                    extValue.value :
                    lookupValue(res, extValue.value);
                break;
            }
            case 'del': {
                const path = [...ext.param.value];

                // Look up parent
                const top = path.pop();
                const topType = typeOf(top);
                const parentVal = lookupValue(res, path);
                const parentValType = typeOf(parentVal);

                if (!parentVal) {
                    throw new Error('Failed to resolve parent value.');
                }

                if (parentValType === 'array') {
                    if (topType !== 'number') {
                        throw new Error(`To delete a array entry you need to specify a index, got ${top} instead.`);
                    }

                    (parentVal as Array<unknown>).splice(top as number, 1);
                } else if (parentValType === 'object') {
                    if (topType !== 'string') {
                        throw new Error('To remove an object-property you need to specify a identifier.');
                    }

                    delete (parentVal as ParsingResultObject)[top as string];
                } else {
                    throw new Error('Target must be an object or array.');
                }
            }
        }
    }
};
