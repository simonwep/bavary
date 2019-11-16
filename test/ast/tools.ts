import {expect}      from 'chai';
import {parseAST}    from '../../src/core/ast';
import {Declaration} from '../../src/core/ast/types';
import {tokenize}    from '../../src/core/tokenizer';

export const parse = (str: string): Array<Declaration> => parseAST(tokenize(str), str);
export const failAll = (tests: Array<string>): void => {
    for (const str of tests) {
        it(`Should throw an error for ${str}`, () => {
            expect(() => parse(str))
                .to.throw();
        });
    }
};
