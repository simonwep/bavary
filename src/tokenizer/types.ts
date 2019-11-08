export type TokenType = 'punc' | 'num' | 'str' | 'kw';

export type RawType = {
    type: TokenType;
    value: string | number;
}

export type Token = {
    start: number;
    end: number;
} & RawType;
