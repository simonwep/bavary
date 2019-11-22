import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Tags', () => {

    it('Should accept tags', () => {
        expect(parse('<name> = ["C" <another-type#abc-123>]')).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'extensions': null,
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': 'C'},
                        {
                            'type': 'reference',
                            'multiplier': null,
                            'join': null,
                            'extensions': null,
                            'tag': 'abc-123',
                            'spread': false,
                            'value': ['another-type']
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept strings as tags', () => {
        expect(parse('<name> = [<another-type#"Hello World">]')).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'extensions': null,
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'reference',
                            'extensions': null,
                            'join': null,
                            'multiplier': null,
                            'tag': 'Hello World',
                            'spread': false,
                            'value': ['another-type']
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse multipliers after tags', () => {
        expect(parse('<name> = [<another-type#abc-123>+]*')).to.deep.equal([
            {
                'type': 'declaration',
                'variant': null,
                'name': 'name',
                'value': {
                    'type': 'group',
                    'extensions': null,
                    'multiplier': {
                        'type': 'zero-infinity',
                        'value': '*'
                    },
                    'value': [
                        {
                            'type': 'reference',
                            'multiplier': {
                                'type': 'one-infinity',
                                'value': '+'
                            },
                            'tag': 'abc-123',
                            'spread': false,
                            'join': null,
                            'extensions': null,
                            'value': ['another-type']
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
