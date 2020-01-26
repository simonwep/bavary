import {MemberExpressionPath} from '../ast/types';
import {evalMemberExpression} from './tools/eval-member-expression';

// Possible node types
export type NodeType = 'object' | 'array' | 'string';

// All possible values used by nodes
export type NodeValue = symbol | string | number | null |
    Array<NodeValue> | {[key: string]: NodeValue} | ObjectNodeValue;

// Types used in array-nodes
export type ArrayNodeValue = Array<NodeValue>;

// Object-structures for object-nodes
export type ObjectNodeValue = {[key: string]: NodeValue};

// Properties, used in all kinds of nodes
type NodeExtensions = {
    lookup(path: MemberExpressionPath): unknown;
    parent: Node | null;
};

// This type covers all possible nodes
export type Node = (StringNode | ObjectNode | ArrayNode) & NodeExtensions

export type StringNode = {
    type: 'string';
    value: string;
} & NodeExtensions;

export type ObjectNode = {
    type: 'object';
    value: ObjectNodeValue;
} & NodeExtensions;

export type ArrayNode = {
    type: 'array';
    value: ArrayNodeValue;
} & NodeExtensions;

const resolveNodeValue = (type: NodeType): NodeValue => {
    switch (type) {
        case 'object': {
            return {};
        }
        case 'string': {
            return '';
        }
        case 'array': {
            return [];
        }
    }
};

/**
 * Creates a new node, based on the type with an optional parent
 * @param type
 * @param parent
 */
export const createNode = (type: NodeType, parent?: Node): StringNode | ObjectNode | ArrayNode => ({
    type, // Type of node
    parent, // Optional parent
    value: resolveNodeValue(type), // Base value

    /**
     * Looks up a property on this node (including child-nodes).
     * Returns undefined if nothing got found.
     * @param path
     */
    lookup(path: MemberExpressionPath): unknown {

        if (this.type) {
            const value = evalMemberExpression(this.value, path);

            if (value !== undefined) {
                return value;
            }
        }

        if (this.parent) {
            return this.parent.lookup(path);
        }

        return undefined;
    }
} as StringNode | ObjectNode | ArrayNode);
