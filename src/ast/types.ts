import {TokenStream} from '../tokenizer/token-stream';

export type ParserFunction<T> = (stream: TokenStream) => T | null;

export type DeclarationValue = Group | Block;
export type DeclarationVariant = 'entry' | 'default' | 'export' | null;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: DeclarationVariant;
    value: DeclarationValue;
    arguments: Arguments | null;
};

export type Arguments = Array<Argument>;
export type Argument = {
    name: string;
    value: Group | null;
};

export type Block = {
    type: 'block';
    value: Array<Declaration>;
};

export type GroupValue = Reference | Literal | Combinator | Group | Spread |
    CharacterSelection | GroupCommand | ConditionalStatement | FunctionCall | VoidStatement;

export type Group = {
    type: 'group';
    mode: 'object' | 'array' | 'string' | null;
    multiplier: Multiplier | null;
    value: Array<GroupValue>;
};

export type Combinator = {
    type: 'combinator';
    sign: '|' | '&&' | '&';
    value: Array<GroupValue>;
};

// Literals
export type LiteralValues = Array<Literal | StringLiteral | MemberExpression>;
export type StringLiteral = {
    type: 'string-litereal';
    value: string;
};

export type Literal = {
    type: 'literal';
    value: LiteralValues;
};

// Type-reference
export type Reference = {
    type: 'reference';
    multiplier: Multiplier | null;
    arguments: Arguments | null;
    value: Array<string>;
};

// Character selection
export type CharacterSelectionArray = Array<number | [number, number]>;
export type CharacterSelection = {
    type: 'character-selection';
    multiplier: Multiplier | null;
    included: CharacterSelectionArray;
    excluded: CharacterSelectionArray;
};

// Member-expression
export type MemberExpressionPath = Array<string | number>; // <identifier | array-index>
export type MemberExpression = {
    type: 'member-expression';
    value: MemberExpressionPath;
};

// Multiplier, used by character-selection and references
export type Multiplier = {
    type: 'zero-infinity' | 'one-infinity' | 'optional' | 'range';
    value: MultiplierRange | '*' | '+' | '?';
};

export type MultiplierRange = {
    start: number;
    end: number;
};

// Binary expression
export type BinaryExpressionValue = BinaryExpression | UnaryExpression | Literal | Numeral | Identifier | MemberExpression;
export type BinaryOperator = '|' | '&' | '<' | '>' | '==' | '!=' | '>=' | '<=';
export type BinaryExpression = {
    type: 'binary-expression';
    operator: BinaryOperator;
    left: BinaryExpressionValue;
    right: BinaryExpressionValue;
};

export type UnaryExpression = {
    type: 'unary-expression';
    sign: '!';
    argument: BinaryExpression;
};

// Possible commands
export type GroupCommand = ReturnStatement | DefineStatement | UseStatement | PushStatement | RemoveStatement | VoidStatement | ThrowStatement;

// Keyword-based statements
export type RemoveStatement = {
    type: 'remove';
    value: MemberExpression;
};

export type DefineStatement = {
    type: 'define';
    name: string;
    value: Group | Reference | Literal | MemberExpression;
};

export type UseStatement = {
    type: 'use';
    name: string;
    value: Group | Reference | Literal | MemberExpression;
};

export type ReturnStatement = {
    type: 'return';
    value: Literal | MemberExpression;
};

export type PushStatement = {
    type: 'push';
    value: Group | Literal;
};

export type VoidStatement = {
    type: 'ignored';
    value: Group;
};

export type ThrowStatement = {
    type: 'throw';
    value: Literal;
};

// Spread statement
export type Spread = {
    type: 'spread';
    value: MemberExpression | Reference | Group | Literal;
};

// Function calls
export type FunctionCallArgument = Group | Literal | Identifier | MemberExpression;
export type FunctionCall = {
    type: 'function-call';
    name: string;
    args: Array<FunctionCallArgument>;
};

export type Identifier = {
    type: 'identifier';
    value: string;
};

export type Numeral = {
    type: 'number';
    value: number;
};

// Conditional statement
export type ConditionalStatement = {
    type: 'conditional-statement';
    condition: BinaryExpression;
    consequent: Group;
    alternate: Group | ConditionalStatement | null;
};
