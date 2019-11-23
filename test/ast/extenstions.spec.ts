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
        `)).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'container',
                            'multiplier': null,
                            'modifiers': [
                                {
                                    'type': 'def',
                                    'key': 'hello',
                                    'value': 'world'
                                },
                                {
                                    'type': 'def',
                                    'key': 'thats',
                                    'value': 'awesome'
                                }
                            ],
                            'join': null,
                            'spread': false,
                            'value': {
                                'type': 'reference',
                                'value': [
                                    'abc'
                                ]
                            },
                            'tag': null
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        'entry [<abc#wow{>]',
        'entry [<abc#wow{def}>]',
        'entry [<abc#wow{del}>]',
        'entry [<abc#wow{del hello = }>]',
        'entry [<abc#wow{def hello = }>]',
        'entry [<abc#wow{def hello = "world",}>]',
    ]);
});
