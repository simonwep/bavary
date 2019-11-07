import {GroupValue}          from '../../ast/types';
import {ParsingResultObject} from '../types';

/**
 * Serializes, e.g nullish, tagged types which got not matched
 * @param rest Array of declaration
 * @param target Result-obj
 * @param nullish Override existing values
 */
export default function serialize(rest: Array<GroupValue>, target: ParsingResultObject, nullish = false): void {
    for (const item of rest) {

        // Check if item is a type, has a tag and the tag wasn't already used
        if (item.type === 'type' && item.tag && ((typeof target[item.tag] === 'undefined') || nullish)) {
            target[item.tag] = null;
        } else if (item.type === 'group') {
            serialize(item.value, target);
        }
    }
}
