import {RangeInformation} from '../misc/stream';

export type TokenType = 'punc' | 'num' | 'str' | 'kw';

export type RawType = {
    type: TokenType;
    value: string | number;
} & RangeInformation;