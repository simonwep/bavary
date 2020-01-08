import {TokenStream} from '../tokenizer/stream/token-stream';

export type ASTNode = Declaration | CharacterSelection | ValueAccessor | ConditionalStatement |
    Ignored | Arguments | Func | Multiplier | Tag | BinaryExpressionValue | Type | Group | Reference | Block | Str;

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

export type Arguments = Array<Argument>;
export type Argument = {
    type: 'argument';
    name: string;
    value: Group | null;
}

export type GroupValue = Reference | Str | BinaryCombinator | Group |
    CharacterSelection | GroupStatement | ConditionalStatement | Func | Ignored;

export type Group = {
    type: 'group';
    mode: 'object' | 'array' | 'string';
    multiplier: Multiplier | null;
    value: Array<GroupValue>;
}

// TODO: Use better names for them
export type GroupStatement = GroupObjectDefineStatement | GroupArrayPushStatement;
export type GroupObjectDefineStatement = {
    type: 'define';
    name: string;
    value: Group | string;
}

export type GroupArrayPushStatement = {
    type: 'push';
    value: Group | string;
}


export type Ignored = {
    type: 'ignored';
    value: Group;
}

export type BinaryCombinator = {
    type: 'combinator';
    sign: string;
    value: Array<GroupValue>;
}

export type MultiplierRange = {
    start: number;
    end: number;
}

export type Multiplier = {
    type: 'zero-infinity' | 'one-infinity' | 'optional' | 'range';
    value: MultiplierRange | '*' | '+' | '?';
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

export type Type = {
    type: 'type';
    value: string;
}

export type Reference = {
    type: 'reference';
    multiplier: Multiplier | null;
    arguments: Arguments | null;
    value: Array<string>;
    spread: boolean;
}

export type FuncArgument = Group | Str | Tag | Identifier;
export type Func = {
    type: 'function';
    name: string;
    args: Array<FuncArgument>;
}

export type Tag = {
    type: 'tag';
    value: string;
}

export type CharacterSelection = {
    type: 'character-selection';
    multiplier: Multiplier | null;
    included: CharacterSelectionArray;
    excluded: CharacterSelectionArray;
}

export type CharacterSelectionArray = Array<number | [number, number]>;
export type Block = {
    type: 'block';
    value: Array<Declaration>;
}

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

export type BinaryExpressionValue = BinaryExpression | Str | Identifier | Num | ValueAccessor;
export type BinaryOperator = '|' | '&' | '=' | '<' | '>' | '!=' | '>=' | '<=';
export type BinaryExpression = {
    type: 'binary-expression';
    operator: BinaryOperator;
    left: BinaryExpressionValue;
    right: BinaryExpressionValue;
}
