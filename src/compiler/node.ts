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

// Properties used in all kind of nodes
type NodeExtensions = {
    lookup(path: MemberExpressionPath): NodeValue;
    return(value: NodeValue | null): void;
    returns: boolean;
};

export type StringNode = NodeExtensions & {
    type: 'string';
    value: string;
};

export type ObjectNode = NodeExtensions & {
    value: ObjectNodeValue;
    type: 'object';
};

export type ArrayNode = NodeExtensions & {
    value: ArrayNodeValue;
    type: 'array';
};

export type NodeVariant = StringNode | ObjectNode | ArrayNode;

export class TypedNode {

    // If this node "returns" the value, at this point value could be anything.
    public returns: boolean;

    // Type and value of this node
    public readonly type: NodeType;

    // This may have a parent-node
    public readonly parent: NodeVariant | null;
    public value: NodeValue;

    private constructor(type: NodeType, parent?: NodeVariant) {
        this.returns = false;
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
    public lookup(path: MemberExpressionPath): NodeValue | undefined {
        const value = evalMemberExpression(this.value, path) as NodeValue | undefined;

        // This node might contain the value
        if (value !== undefined) {
            return value;
        }

        // Check parent
        if (this.parent) {
            return this.parent.lookup(path);
        }

        // Lookup failed for this node (and its children)
        return undefined;
    }

    public return(value: NodeValue | null): void {
        this.returns = true;
        this.value = value;
    }
}
