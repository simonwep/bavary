import {expect} from 'chai';
import parseAst from '../../src/core/ast';

export const parse = parseAst;
export const failAll = (tests: Array<string>): void => {
    for (const str of tests) {
        it(`Should throw an error for ${str}`, () => {
            expect(() => parseAst(str))
                .to.throw();
        });
    }
};
