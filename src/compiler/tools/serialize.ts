import {GroupValue}       from '../../ast/types';
import {REMOVED_PROPERTY} from '../internal';
import {ObjectNode}       from '../node';

/**
 * Serializes, e.g nullish, tagged types which got not matched
 * @param rest Array of declaration
 * @param target Result-obj
 * @param nullish Override existing values
 */
export function serializeParsingResult(rest: Array<GroupValue>, target: ObjectNode, nullish = false): void {
    const {value} = target;

    for (const item of rest) {

        // Check if item is a reference
        if (item.type === 'define') {
            const itemValue = value[item.name];

            // Set value only to null if it's not defined yet
            if (typeof itemValue === 'undefined' || nullish) {
                value[item.name] = null;
            } else if (itemValue === REMOVED_PROPERTY) {
                delete value[item.name];
            }

        } else if (item.type === 'group' || item.type === 'combinator') {
            serializeParsingResult(item.value, target, nullish);
        } else if (item.type === 'conditional-statement') {
            serializeParsingResult([item.consequent], target, nullish);
            item.alternate && serializeParsingResult([item.alternate], target, nullish);
        }
    }
}
