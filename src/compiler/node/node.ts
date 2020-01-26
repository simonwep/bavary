import {ArrayNode, ObjectNode, StringNode} from '.';
import {MemberExpressionPath}              from '../../ast/types';
import {evalMemberExpression}              from '../tools/eval-member-expression';

export type NodeValue = symbol | string | number | null |
    Array<NodeValue> | {[key: string]: NodeValue} | ObjectNodeValue;

export type ArrayNodeValue = Array<NodeValue>;
export type ObjectNodeValue = {[key: string]: NodeValue}

export abstract class Node {
    protected readonly parent: Node | null;
    public abstract readonly type: 'object' | 'array' | 'string';
    public abstract value: NodeValue;

    constructor(parent?: Node) {
        this.parent = parent || null;
    }

    public static create(type: 'object' | 'array' | 'string', parent?: Node): ObjectNode | ArrayNode | StringNode {
        switch (type) {
            case 'object':
                return new ObjectNode(parent);
            case 'string':
                return new StringNode(parent);
            case 'array':
                return new ArrayNode(parent);
        }
    }

    public lookup(path: MemberExpressionPath): unknown {

        if (this instanceof ObjectNode || this instanceof ArrayNode) {
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
}

