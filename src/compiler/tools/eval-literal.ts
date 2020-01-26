import {Literal}                     from '../../ast/types';
import {ArrayNode, Node, ObjectNode} from '../node';

export const evalLiteral = (node: Node, decl: Literal): string => {
    const {value} = decl;
    let str = '';

    for (const part of value) {
        let raw = null;

        // Resolve value
        switch (part.type) {
            case 'member-expression': {

                if (node instanceof ObjectNode || node instanceof ArrayNode) {
                    raw = node.lookup(part.value);
                } else {
                    break;
                }

                // Ignore null or undefined values
                if (raw === null || raw === undefined) {
                    break;
                }

                // Strict-check if it's not a string or number
                if (typeof raw !== 'string' && typeof raw !== 'number') {
                    throw new Error(`Evaluated value of "${part.value.pop()}" not a string or number.`);
                }

                break;
            }
            case 'literal': {
                raw = evalLiteral(node, part);
                break;
            }
            case 'string-litereal': {
                raw = part.value;
            }
        }

        str += raw || '';
    }

    return str;
};
