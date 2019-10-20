const {expect} = require('chai');
const tokenize = require('../../src/tokenizer');


describe('Tokenizer', () => {

    it('Should parse "<num-sign> = [ "+" | "-" ]"', () => {
        expect(tokenize('<num-sign> = [ "+" | "-" ]')).to.deep.equal([
            {type: 'punc', value: '<'},
            {type: 'kw', value: 'num'},
            {type: 'punc', value: '-'},
            {type: 'kw', value: 'sign'},
            {type: 'punc', value: '>'},
            {type: 'punc', value: '='},
            {type: 'punc', value: '['},
            {type: 'str', value: '+'},
            {type: 'punc', value: '|'},
            {type: 'str', value: '-'},
            {type: 'punc', value: ']'}
        ]);
    });

    it('Should throw an error on unescaped sequences like "123"', () => {
        expect(() => tokenize('123')).to.throw();
    });
});
