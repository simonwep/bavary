export type ASTNode = Declaration | CharacterSelection |
    Type | Group | Multiplier | Reference | Block | Str;

export type DeclarationValue = Group | Block;
export type DeclarationVariant = 'entry' | 'default' | 'export' | null;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: DeclarationVariant;
    value: DeclarationValue;
}

export type GroupValue = Reference | Str | BinaryCombinator | Group | CharacterSelection | Func;
export type Group = {
    type: 'group';
    multiplier: Multiplier;
    value: Array<GroupValue>;
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

export type Str = {
    type: 'string';
    value: string;
}

export type Type = {
    type: 'type';
    value: string;
}

export type Reference = {
    type: 'reference';
    multiplier: Multiplier | null;
    modifiers: Modifiers | null;
    value: Array<string>;
    join: string | null;
    tag: string | null;
    spread: boolean;
}

export type DeleteModifier = {
    type: 'del';
    param: ValueAccessor;
}

export type DefineModifier = {
    type: 'def';
    key: string;
    value: Str | ValueAccessor;
}

export type Modifier = DefineModifier | DeleteModifier;
export type Modifiers = Array<Modifier>;
export type ModifierTarget = {[key: string]: unknown};

export type FuncArgument = Group | Str | Tag | Reference;
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

export type CharacterSelectionArray = Array<CharacterSelectionRange | CharacterSelectionCode>;
export type CharacterSelectionCode = {
    type: 'character';
    value: number;
}

export type CharacterSelectionRange = {
    type: 'range';
    from: number;
    to: number;
}

export type Block = {
    type: 'block';
    value: Array<Declaration>;
}

export type ValueAccessorPath = Array<string | number>; // <identifier | array-index>
export type ValueAccessor = {
    type: 'value-accessor';
    value: ValueAccessorPath;
}
