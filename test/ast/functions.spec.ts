import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Modifiers', () => {

    it('Should parse a function call', () => {
        expect(parse(`
            entry [
                '(' count([(0 - 9)+], 'count', #tag) ')'
            ]
        `)).to.deep.equal([{
            'type': 'declaration',
            'name': null,
            'variant': 'entry',
            'value': {
                'type': 'group',
                'multiplier': null,
                'value': [
                    {'type': 'string', 'value': '('},
                    {
                        'type': 'function',
                        'name': 'count',
                        'args': [
                            {
                                'type': 'group',
                                'multiplier': null,
                                'value': [
                                    {
                                        'type': 'character-selection',
                                        'multiplier': {
                                            'type': 'one-infinity',
                                            'value': '+'
                                        },
                                        'included': [
                                            {'type': 'range', 'from': 48, 'to': 57}
                                        ],
                                        'excluded': []
                                    }
                                ]
                            },
                            {'type': 'string', 'value': 'count'},
                            {'type': 'tag', 'value': 'tag'}
                        ]
                    },
                    {'type': 'string', 'value': ')'}
                ]
            }
        }]);
    });

    failAll([
        'entry [parse(asda)]',
        'entry [parse(#)]'
    ]);
});
