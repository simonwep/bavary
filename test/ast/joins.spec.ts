import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Joins', () => {

    it('Should properly parse a piped result', () => {
        expect(parse(`
            entry [
                <abc#start>
                <efg> -> start
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
                            'modifiers': null,
                            'join': null,
                            'spread': false,
                            'value': {
                                'type': 'reference',
                                'value': [
                                    'abc'
                                ],
                            },
                            'tag': 'start'
                        },
                        {
                            'type': 'container',
                            'multiplier': null,
                            'modifiers': null,
                            'join': 'start',
                            'spread': false,
                            'value': {
                                'type': 'reference',
                                'value': [
                                    'efg'
                                ],
                            },
                            'tag': null
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        'entry [<abc> <efg> -]',
        'entry [<abc> <efg> ->]',
        'entry [<abc> <efg> ->',
        'entry [<abc#super> -> oh]',
        'entry [...<abc> -> oh]'
    ]);
});
