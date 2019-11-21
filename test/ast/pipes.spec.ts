import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Pipe-ing', () => {

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
                    'extensions': null,
                    'value': [
                        {
                            'type': 'reference',
                            'multiplier': null,
                            'extensions': null,
                            'pipeInto': null,
                            'spread': false,
                            'value': [
                                'abc'
                            ],
                            'tag': 'start'
                        },
                        {
                            'type': 'reference',
                            'multiplier': null,
                            'extensions': null,
                            'pipeInto': 'start',
                            'spread': false,
                            'value': [
                                'efg'
                            ],
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
