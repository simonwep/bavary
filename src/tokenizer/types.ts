export type TokenType = 'punc' | 'num' | 'kw' | 'ws';

export type Token = {
    type: TokenType;
    value: string | number;
} & RangeInformation;

export type RangeInformation = {
    start: number;
    end: number;
}
