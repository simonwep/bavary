export type TokenType = 'punc' | 'num' | 'str' | 'kw' | 'ws';

export type Token = {
    type: TokenType;
    value: string | number;
} & RangeInformation;

export type RangeInformation = {
    start: number;
    end: number;
}
