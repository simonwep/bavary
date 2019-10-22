const {expect} = require('chai');
const tokenizer = require('../../src/tokenizer');
const ast = require('../../src/ast');

module.exports.parse = str => ast(tokenizer(str));
module.exports.failAll = tests => {
    for (const str of tests) {
        it(`Should throw an error for ${str}`, () => {
            expect(() => ast(tokenizer(str)))
                .to.throw();
        });
    }
};
