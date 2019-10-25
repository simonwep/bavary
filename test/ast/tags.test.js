const {parse, failAll} = require('./tools');
const {expect} = require('chai');

describe('Tags', () => {

    it('Should accept tags', () => {
        expect(parse(`<name> = ['C' <another-type#abc-123>]`)).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': 'C'},
                        {
                            'type': 'type',
                            'multiplier': null,
                            'tag': 'abc-123',
                            'value': 'another-type'
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept strings as tags', () => {
        expect(parse(`<name> = [<another-type#'Hello World'>]`)).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'type',
                            'multiplier': null,
                            'tag': 'Hello World',
                            'value': 'another-type'
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse multipliers after tags', () => {
        expect(parse(`<name> = [<another-type#abc-123>+]*`)).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'multiplier': {
                        'type': 'zero-infinity',
                        'value': '*'
                    },
                    'value': [
                        {
                            'type': 'type',
                            'multiplier': {
                                'type': 'one-infinity',
                                'value': '+'
                            },
                            'tag': 'abc-123',
                            'value': 'another-type'
                        }
                    ]
                }
            }
        ]);
    });


    failAll([
        '<abc> = ["A"#]',
        '<abc> = []+#abc'
    ]);
});
