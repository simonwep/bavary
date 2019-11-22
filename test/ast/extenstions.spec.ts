import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Extensions', () => {

    it('Should propely parse extensions assigned to a type', () => {
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
                            'type': 'reference',
                            'multiplier': null,
                            'join': null,
                            'value': [
                                'abc'
                            ],
                            'extensions': [
                                {
                                    'key': 'hello',
                                    'type': 'def',
                                    'value': 'world'
                                },
                                {
                                    'key': 'thats',
                                    'type': 'def',
                                    'value': 'awesome'
                                }
                            ],
                            'spread': false,
                            'tag': null
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        'entry [ <abc> where ()]',
        'entry [<abc> where (hello = )]',
        'entry [<abc> where (hello = asda)]',
        'entry [<abc> where (hello = \'world\',)]',
        'entry [<abc> where (hello = \'\',)]',
        'entry [<abc> where (hello = \'a)]'
    ]);
});
