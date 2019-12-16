import {GroupValue}    from '../../ast/types';
import {ParsingResult} from '../types';

/**
 * Serializes, e.g nullish, tagged types which got not matched
 * @param rest Array of declaration
 * @param target Result-obj
 * @param nullish Override existing values
 */
export function serializeParsingResult(rest: Array<GroupValue>, target: ParsingResult, nullish = false): void {
    const {obj} = target;

    for (const item of rest) {

        // Check if item is a reference
        if (item.type === 'reference' && item.tag) {

            // Set value only to null if it's not defined yet
            if (typeof obj[item.tag] === 'undefined' || nullish) {
                obj[item.tag] = null;
            }


            target.pure = false;
        } else if (item.type === 'group' || item.type === 'combinator') {
            serializeParsingResult(item.value, target, nullish);
        } else if (item.type === 'conditional-statement') {
            serializeParsingResult([item.then], target, nullish);
            item.alternative && serializeParsingResult([item.alternative], target, nullish);
        }
    }
}
