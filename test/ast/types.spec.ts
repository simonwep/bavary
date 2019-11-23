import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Types', () => {

    it('Should propely parse a named entry type an a container', () => {
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
                            'type': 'container',
                            'spread': false,
                            'modifiers': null,
                            'join': null,
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
        ]);
    });

    failAll([
        '<> = ["A"]',
        '<abc> = ["A" | <>]',
        '<abc> = [...<a#b>]',
        '<abc> = ["A" | <a:b:>]'
    ]);
});
