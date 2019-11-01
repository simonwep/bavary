const {parse, failAll} = require('./tools');
const {expect} = require('chai');

describe('[AST] Simple group declarations', () => {

    it('Should parse: "<a-value> = [ \'0\' | \'1\']"', () => {
        expect(parse(`<a-value> = [ '0' | '1']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a-value',
                'variant': null,
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': '0'},
                                {'type': 'string', 'value': '1'}
                            ]
                        }
                    ]
                }
            }

        ]);
    });

    it('Should parse nested groups', () => {
        expect(parse(`<another-value> = [ '0' | '1' | ['5' | 'C']]`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'another-value',
                'variant': null,
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': '0'},
                                {'type': 'string', 'value': '1'},
                                {
                                    'type': 'group',
                                    'multiplier': null,
                                    'value': [
                                        {
                                            'type': 'combinator',
                                            'sign': '|',
                                            'value': [
                                                {'type': 'string', 'value': '5'},
                                                {'type': 'string', 'value': 'C'}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        '<vvv',
        '<abc..> = ["A"]',
        '<abc> = [',
        '<abc> = ["A" | "B" | []',
        '<abc> = [A""]'
    ]);
});
