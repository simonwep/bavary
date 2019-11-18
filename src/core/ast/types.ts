export type ASTNode = Declaration | Combinator | CharacterSelection |
    Identifier | Type | Group | Multiplier | Reference | Block | string;

export type DeclarationValue = Group | Block;
export type DeclarationVariant = 'entry' | 'default' | 'export' | null;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: DeclarationVariant;
    value: DeclarationValue;
}

export type GroupValue = Reference | Str | GroupedCombinator | Group;
export type Group = {
    type: 'group';
    multiplier: Multiplier;
    extensions: ExtensionSet | null;
    value: Array<GroupValue>;
}

export type GroupedCombinator = {
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
    extensions: ExtensionSet | null;
    value: Array<string>;
    tag: string | null;
    spread: boolean;
}

export type LookupSequence = {
    type: 'lookup-sequence';
    value: Array<string>;
}

export type ExtensionSet = {
    [key: string]: string;
}

export type Identifier = {
    type: 'identifier';
    value: string;
}

export type Combinator = {
    type: 'combinator';
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
