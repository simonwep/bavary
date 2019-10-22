const {parse, failAll} = require('./tools');
const {expect} = require('chai');

describe('Simple group declarations', () => {

    it('Should parse: "<a-value> = [ \'0\' | \'1\']"', () => {
        expect(parse(`<a-value> = [ '0' | '1']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'a-value'
                },
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': '0'},
                        {'type': 'combinator', 'value': '|'},
                        {'type': 'string', 'value': '1'}
                    ]
                }
            }
        ]);
    });

    it('Should parse nested groups', () => {
        expect(parse(`<another-value> = [ '0' | '1' | ['5' | 'C']]`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'another-value'
                },
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': '0'},
                        {'type': 'combinator', 'value': '|'},
                        {'type': 'string', 'value': '1'},
                        {'type': 'combinator', 'value': '|'},
                        {
                            'type':
                                'group',
                            'multiplier': null,
                            'value': [
                                {'type': 'string', 'value': '5'},
                                {'type': 'combinator', 'value': '|'},
                                {'type': 'string', 'value': 'C'}
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
