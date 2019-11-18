import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Simple group declarations', () => {

    it('Should parse: "<a-value> = [ "0" | "1"]"', () => {
        expect(parse('<a-value> = [ "0" | "1"]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a-value',
                'variant': null,
                'value': {
                    'type': 'group',
                    'extensions': null,
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': '0'},
                                {'type': 'string', 'value': '1'}
                            ]
                        }
                    ]
                }
            }

        ]);
    });

    it('Should parse nested groups', () => {
        expect(parse('<another-value> = [ "0" | "1" | ["5" | "C"]]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'another-value',
                'variant': null,
                'value': {
                    'type': 'group',
                    'extensions': null,
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': '0'},
                                {'type': 'string', 'value': '1'},
                                {
                                    'type': 'group',
                                    'extensions': null,
                                    'multiplier': null,
                                    'value': [
                                        {
                                            'type': 'combinator',
                                            'sign': '|',
                                            'value': [
                                                {'type': 'string', 'value': '5'},
                                                {'type': 'string', 'value': 'C'}
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
                    'extensions': null,
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
                                    'extensions': null,
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
