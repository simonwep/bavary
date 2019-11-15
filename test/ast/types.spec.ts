import {failAll, parse} from './tools';
import {expect}         from 'chai';

describe('[AST] Types', () => {

    it('Should propely parse a named entry type an a reference', () => {
        expect(parse('entry <a> = [<a:b:c>]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'reference',
                            'multiplier': null,
                            'value': [
                                'a',
                                'b',
                                'c'
                            ],
                            'tag': null
                        }
                    ]
                }
            }
        ]
        );
    });

    failAll([
        '<> = ["A"]',
        '<abc> = ["A" | <>]',
        '<abc> = ["A" | <a:b:>]'
    ]);
});
