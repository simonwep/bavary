const ast = require('../../src/ast');
const {expect} = require('chai');

module.exports.parse = ast;
module.exports.failAll = tests => {
    for (const str of tests) {
        it(`Should throw an error for ${str}`, () => {
            expect(() => ast(str))
                .to.throw();
        });
    }
};
