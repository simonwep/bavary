import {Node, ObjectNodeValue} from '.';

export class ObjectNode extends Node {
    public readonly type = 'object';
    public value: ObjectNodeValue = {};
}
