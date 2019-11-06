export type ASTNode = {}

export type Declaration = {
    type: 'declaration';
    name: string | null;
    variant: string | null;
    value: ASTNode;
} & ASTNode;

export type Group = {
    type: 'group';
}

export type Multiplier = {
    type: 'zero-infinity' | 'one-infinity' | 'optional' | 'range';
    value: {
        start: number;
        end: number;
    } | '*' | '+' | '?';
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
