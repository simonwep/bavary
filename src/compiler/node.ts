import {MemberExpressionPath} from '../ast/types';
import {evalMemberExpression} from './tools/eval-member-expression';

// Possible node types
export type NodeType = 'object' | 'array' | 'string';

// All possible values used by nodes
export type NodeValue = symbol | string | number | null | Array<NodeValue> | ObjectNodeValue;

// Types used in array-nodes
export type ArrayNodeValue = Array<NodeValue>;

// Object-structures for object-nodes
export type ObjectNodeValue = {[key: string]: NodeValue};

export type StringNode = {
    lookup(path: MemberExpressionPath): unknown;
    return(value: NodeValue | null): void;
    returned: boolean;
    type: 'string';
    value: string;
};

export type ObjectNode = {
    lookup(path: MemberExpressionPath): unknown;
    return(value: NodeValue | null): void;
    returned: boolean;
    value: ObjectNodeValue;
    type: 'object';
};

export type ArrayNode = {
    lookup(path: MemberExpressionPath): unknown;
    return(value: NodeValue | null): void;
    returned: boolean;
    value: ArrayNodeValue;
    type: 'array';
};

export type NodeVariant = StringNode | ObjectNode | ArrayNode

export class TypedNode {
    public returned: boolean;
    public readonly type: NodeType;
    private readonly parent: NodeVariant | null;
    public value: NodeValue;

    private constructor(type: NodeType, parent?: NodeVariant) {
        this.returned = false;
        this.parent = parent || null;
        this.type = type;
        this.value = TypedNode.resolveNodeValue(type);
    }

    /**
     * Creates a new node, based on the type with an optional parent
     * @param type
     * @param parent
     */
    static create(type: NodeType, parent?: NodeVariant): NodeVariant {
        return new TypedNode(
            type, parent
        ) as NodeVariant;
    }

    /**
     * Resolves the value for a specific node-type
     * @param type
     */
    static resolveNodeValue(type: NodeType): NodeValue {
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
    }

    /**
     * Looks up a property on this node (including child-nodes).
     * Returns undefined if nothing got found.
     * @param path
     */
    public lookup(path: MemberExpressionPath): unknown {
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

    public return(value: NodeValue | null): void {
        this.returned = true;
        this.value = value;
    }
}