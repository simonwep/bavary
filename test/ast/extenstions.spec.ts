import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Modifiers', () => {

    it('Should propely parse modifiers assigned to a type', () => {
        expect(parse(`
            entry [
                <abc{
                    def hello = 'world',
                    def thats = 'awesome'
                }>
            ]
        `)).to.deep.equal([{
            'type': 'declaration',
            'name': null,
            'variant': 'entry',
            'value': {
                'type': 'group',
                'multiplier': null,
                'value': [
                    {
                        'type': 'reference',
                        'multiplier': null,
                        'modifiers': [
                            {
                                'type': 'def',
                                'key': 'hello',
                                'value': {
                                    'type': 'string',
                                    'value': 'world'
                                }
                            },
                            {
                                'type': 'def',
                                'key': 'thats',
                                'value': {
                                    'type': 'string',
                                    'value': 'awesome'
                                }
                            }
                        ],
                        'join': null,
                        'spread': false,
                        'value': [
                            'abc'
                        ],
                        'tag': null
                    }
                ]
            }
        }]);
    });

    it('Should propely parse value-accessors', () => {
        expect(parse(`
            entry [
                <abc{
                    def hello = abc.sup-nice[1].ok
                }>
            ]
        `)).to.deep.equal([{
            'type': 'declaration',
            'name': null,
            'variant': 'entry',
            'value': {
                'type': 'group',
                'multiplier': null,
                'value': [
                    {
                        'type': 'reference',
                        'multiplier': null,
                        'modifiers': [
                            {
                                'type': 'def',
                                'value': {
                                    'type': 'value-accessor',
                                    'value': [
                                        'abc',
                                        'sup-nice',
                                        1,
                                        'ok'
                                    ]
                                },
                                'key': 'hello'
                            }
                        ],
                        'spread': false,
                        'value': [
                            'abc'
                        ],
                        'join': null,
                        'tag': null
                    }
                ]
            }
        }]);
    });

    failAll([
        'entry [<abc#wow{>]',
        'entry [<abc#wow{def}>]',
        'entry [<abc#wow{del}>]',
        'entry [<abc#wow{del hello = }>]',
        'entry [<abc#wow{def hello = }>]',
        'entry [<abc#wow{def hello = "world",}>]',
        'entry [<abc#wow{def hello = ab.}>]',
        'entry [<abc#wow{def hello = ab[2}>]',
        'entry [<abc#wow{def hello = ab[-}>]',
    ]);
});
