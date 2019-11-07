export type ASTNode = {
    type: string;
}

export type DeclarationValue = Group | Block;
export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: string | null;
    value: DeclarationValue;
} & ASTNode;

export type GroupValue = Type | Str | GroupedCombinator | Group | CharacterRange;
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
    multiplier: Multiplier | null;
    value: string;
    tag: string | null;
}

export type Identifier = {
    type: 'identifier';
    value: string;
}

export type Combinator = {
    type: 'combinator';
    value: string;
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
