export type TokenType = 'punc' | 'num' | 'kw' | 'ws';

export type Token = {
    type: TokenType;
    value: string | number;
} & RangeInformation;

export enum Alternate {
    FAILED = 'FAILED',
    EMPTY = 'EMPTY'
}

export type RangeInformation = {
    start: number;
    end: number;
};
