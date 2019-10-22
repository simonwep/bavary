const {parse, failAll} = require('./tools');
const {expect} = require('chai');

describe('Multipliers', () => {

    it('Should parse multipliers', () => {
        expect(parse(`<another-value> = [ '0' ]+`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'another-value'
                },
                'value': {
                    'type': 'group',
                    'multiplier': {
                        'type': 'single',
                        'value': '+'
                    },
                    'value': [
                        {
                            'type': 'string',
                            'value': '0'
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse nested multipliers', () => {
        expect(parse(`<another-value> = [ '0' | ['C' | 'X']*]+`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'another-value'
                },
                'value': {
                    'type': 'group',
                    'multiplier': {
                        'type': 'single',
                        'value': '+'
                    },
                    'value': [
                        {'type': 'string', 'value': '0'},
                        {'type': 'combinator', 'value': '|'},
                        {
                            'type': 'group',
                            'multiplier': {
                                'type': 'single',
                                'value': '*'
                            },
                            'value': [
                                {'type': 'string', 'value': 'C'},
                                {'type': 'combinator', 'value': '|'},
                                {'type': 'string', 'value': 'X'}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse range multipliers', () => {
        expect(parse(`<abc-123> = ['A' | 'B']{4,6}`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'abc-123'
                },
                'value': {
                    'type': 'group',
                    'multiplier': {
                        'type': 'range',
                        'value': {'start': 4, 'end': 6}
                    },
                    'value': [
                        {'type': 'string', 'value': 'A'},
                        {'type': 'combinator', 'value': '|'},
                        {'type': 'string', 'value': 'B'}
                    ]
                }
            }
        ]);
    });

    failAll([
        '<abc> = ["A" | "B"]++',
        '<abc> = ["B"]~',
        '<abc> = ["A" | "B" | ["1" | "2"]{5,4}]'
    ]);
});
