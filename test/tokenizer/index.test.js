const {expect} = require('chai');
const tokenize = require('../../src/tokenizer');


describe('Tokenizer', () => {

    it('Should parse "<num-sign> = [ "+" | "-" ]"', () => {
        expect(tokenize('<num-sign> = [ "+" | "-" ]')).to.deep.equal([
            {type: 'punc', value: '<', start: 0, end: 1},
            {type: 'kw', value: 'num', start: 1, end: 4},
            {type: 'punc', value: '-', start: 4, end: 5},
            {type: 'kw', value: 'sign', start: 5, end: 9},
            {type: 'punc', value: '>', start: 9, end: 10},
            {type: 'punc', value: '=', start: 11, end: 12},
            {type: 'punc', value: '[', start: 13, end: 14},
            {type: 'str', value: '+', start: 15, end: 18},
            {type: 'punc', value: '|', start: 19, end: 20},
            {type: 'str', value: '-', start: 21, end: 24},
            {type: 'punc', value: ']', start: 25, end: 26}
        ]);
    });

    it('Should throw an error on unescaped sequences like "123"', () => {
        expect(() => tokenize('123')).to.throw();
    });
});
