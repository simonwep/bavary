import {TokenStream} from '../tokenizer/stream/token-stream';

export type ASTNode = Declaration | CharacterSelection | ValueAccessor | ConditionalStatement |
    VoidStatement | Arguments | Func | Multiplier | BinaryExpressionValue | Group | Reference | Block | Str;

export type ParserFunction<T> = (stream: TokenStream) => T | null;

export type DeclarationValue = Group | Block;
export type DeclarationVariant = 'entry' | 'default' | 'export' | null;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: DeclarationVariant;
    value: DeclarationValue;
    arguments: Arguments | null;
}

export type Block = {
    type: 'block';
    value: Array<Declaration>;
}

export type Arguments = Array<Argument>;
export type Argument = {
    name: string;
    value: Group | null;
}

export type GroupValue = Reference | Str | BinaryCombinator | Group | Spread |
    CharacterSelection | GroupCommand | ConditionalStatement | Func | VoidStatement;

export type Group = {
    type: 'group';
    mode: 'object' | 'array' | 'string' | null;
    multiplier: Multiplier | null;
    value: Array<GroupValue>;
}

export type GroupCommand = DefineStatement | PushStatement | VoidStatement;
export type DefineStatement = {
    type: 'define';
    name: string;
    value: Group | Str | ValueAccessor;
}

export type PushStatement = {
    type: 'push';
    value: Group | Str;
}

export type VoidStatement = {
    type: 'ignored';
    value: Group;
}

export type Multiplier = {
    type: 'zero-infinity' | 'one-infinity' | 'optional' | 'range';
    value: MultiplierRange | '*' | '+' | '?';
}

export type MultiplierRange = {
    start: number;
    end: number;
}

export type Num = {
    type: 'number';
    value: number;
}

export type Str = {
    type: 'string';
    value: string;
}

export type Identifier = {
    type: 'identifier';
    value: string;
}

export type Reference = {
    type: 'reference';
    multiplier: Multiplier | null;
    arguments: Arguments | null;
    value: Array<string>;
}

export type Spread = {
    type: 'spread';
    value: Reference | Group;
}

export type FuncArgument = Group | Str | Identifier | ValueAccessor;
export type Func = {
    type: 'function';
    name: string;
    args: Array<FuncArgument>;
}

export type CharacterSelection = {
    type: 'character-selection';
    multiplier: Multiplier | null;
    included: CharacterSelectionArray;
    excluded: CharacterSelectionArray;
}

export type CharacterSelectionArray = Array<number | [number, number]>;
export type ValueAccessorPath = Array<string | number>; // <identifier | array-index>
export type ValueAccessor = {
    type: 'value-accessor';
    value: ValueAccessorPath;
}

export type ConditionalStatement = {
    type: 'conditional-statement';
    condition: BinaryExpression;
    consequent: Group;
    alternate: Group | ConditionalStatement | null;
}

export type BinaryCombinator = {
    type: 'combinator';
    sign: string;
    value: Array<GroupValue>;
}

export type BinaryExpressionValue = BinaryExpression | Str | Identifier | Num | ValueAccessor;
export type BinaryOperator = '|' | '&' | '=' | '<' | '>' | '!=' | '>=' | '<=';
export type BinaryExpression = {
    type: 'binary-expression';
    operator: BinaryOperator;
    left: BinaryExpressionValue;
    right: BinaryExpressionValue;
}
