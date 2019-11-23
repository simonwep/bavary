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
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': 'C'},
                        {
                            'type': 'container',
                            'multiplier': null,
                            'join': null,
                            'modifiers': null,
                            'tag': 'abc-123',
                            'spread': false,
                            'value': {
                                'type': 'reference',
                                'value': ['another-type']
                            }
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
                'name': 'name',
                'variant': null,
                'value': {
                    'type': 'group',
                    'multiplier': {
                        'type': 'zero-infinity',
                        'value': '*'
                    },
                    'value': [
                        {
                            'type': 'container',
                            'multiplier': {
                                'type': 'one-infinity',
                                'value': '+'
                            },
                            'modifiers': null,
                            'join': null,
                            'spread': false,
                            'value': {
                                'type': 'reference',
                                'value': [
                                    'another-type'
                                ]
                            },
                            'tag': 'abc-123'
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
