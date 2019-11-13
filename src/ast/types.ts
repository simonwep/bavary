export type ASTNode = {
    type: string;
}

export type DeclarationValue = Group | Block;
export type DeclarationVariant = 'entry' | 'default' | 'export' | null;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: DeclarationVariant;
    value: DeclarationValue;
} & ASTNode;

export type GroupValue = Reference | Str | GroupedCombinator | Group | CharacterRange;
export type Group = {
    type: 'group';
    multiplier: Multiplier;
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
    value: Array<string>;
    tag: string | null;
}

export type LookupSequence = {
    type: 'lookup-sequence';
    value: Array<string>;
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

export type CharacterRange = {
    type: 'character-range';
    value: {
        from: number;
        to: number;
    };
}

export type Block = {
    type: 'block';
    value: Array<Declaration>;
}
