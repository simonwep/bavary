import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Simple group declarations', () => {

    it('Should properly resolve mixed combinators', () => {
        expect(parse(`
            entry ['a' | 'b' & 'c' | ['d' & 'e' | 'f']]
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
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': 'a'}
                            ]
                        },
                        {
                            'type': 'combinator',
                            'sign': '&',
                            'value': [
                                {'type': 'string', 'value': 'b'}
                            ]
                        },
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': 'c'},
                                {
                                    'type': 'group',
                                    'multiplier': null,
                                    'value': [
                                        {
                                            'type': 'combinator',
                                            'sign': '&',
                                            'value': [
                                                {'type': 'string', 'value': 'd'}
                                            ]
                                        },
                                        {
                                            'type': 'combinator',
                                            'sign': '|',
                                            'value': [
                                                {'type': 'string', 'value': 'e'},
                                                {'type': 'string', 'value': 'f'}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        '<vvv',
        'entry [\'A\' | \'B\'|]',
        '<abc..> = ["A"]',
        '<abc> = [',
        '<abc> = ["A" | "B" | []',
        '<abc> = [A""]'
    ]);
});
