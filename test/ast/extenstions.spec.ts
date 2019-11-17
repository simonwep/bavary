import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Extensions', () => {

    it('Should propely parse extensions assigned to a type', () => {
        expect(parse(`
            entry [
                <abc> with (
                    hello = 'world',
                    thats = 'awesome'
                )
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
                            'value': [
                                'abc'
                            ],
                            'extensions': {
                                'hello': 'world',
                                'thats': 'awesome'
                            },
                            'spread': false,
                            'tag': null
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        'entry [ <abc> with ()]',
        'entry [<abc> with (hello = )]',
        'entry [<abc> with (hello = asda)]',
        'entry [<abc> with (hello = \'world\',)]',
        'entry [<abc> with (hello = \'\',)]',
        'entry [<abc> with (hello = \'a)]'
    ]);
});
