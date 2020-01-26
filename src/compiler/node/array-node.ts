import {ArrayNodeValue, Node} from '.';

export class ArrayNode extends Node {
    public readonly type = 'array';
    public value: ArrayNodeValue = [];
}
