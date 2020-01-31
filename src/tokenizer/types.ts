import {Streamable} from '../streams/streamable';

export type TokenType = 'punc' | 'num' | 'kw' | 'str';

export type Token = {
    type: TokenType;
    value: string | number;
} & RangeInformation;

export type RangeInformation = {
    start: number;
    end: number;
};

export type TokenParser = (
    stream: Streamable<string>,
    tokens: Array<Token>,
    next: () => boolean
) => boolean;
