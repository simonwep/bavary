import {GroupValue}          from '../../ast/types';
import {ParsingResultObject} from '../types';

/**
 * Serializes, e.g nullish, tagged types which got not matched
 * TODO: Serialzation for arrays?
 * @param rest Array of declaration
 * @param target Result-obj
 * @param nullish Override existing values
 */
export function serializeParsingResult(rest: Array<GroupValue>, target: ParsingResultObject, nullish = false): void {
    const {value} = target;

    for (const item of rest) {

        // Check if item is a reference
        // TODO: define alone is not that good, wrap it
        if (item.type === 'define') {

            // Set value only to null if it's not defined yet
            if (typeof value[item.name] === 'undefined' || nullish) {
                value[item.name] = null;
            }
        } else if (item.type === 'group' || item.type === 'combinator') {
            serializeParsingResult(item.value, target, nullish);
        } else if (item.type === 'conditional-statement') {
            serializeParsingResult([item.consequent], target, nullish);
            item.alternate && serializeParsingResult([item.alternate], target, nullish);
        }
    }
}
