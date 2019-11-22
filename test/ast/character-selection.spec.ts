import {expect}         from 'chai';
import {failAll, parse} from './tools';

describe('[AST] Character selection', () => {

    it('Should throw an error on empty strings', () => {
        expect(() => parse('<brr> = [""]')).to.throw();
    });

    it('Should parse simple ranges without exceptions', () => {
        expect(parse('entry [(a - z)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': null,
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122}
                            ],
                            'excluded': []
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse simple ranges with exceptions', () => {
        expect(parse('entry [(a - z except g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': null,
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122}
                            ],
                            'excluded': [
                                {'type': 'character', 'value': 103}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse long, chained ranges with exceptions', () => {
        expect(parse('entry [(a-z, 5, 6, 7 except h-g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': null,
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122},
                                {'type': 'character', 'value': 53},
                                {'type': 'character', 'value': 54},
                                {'type': 'character', 'value': 55}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept escaped punctuation characters', () => {
        expect(parse('entry [(a-z, \\", \\--\\+ except h-g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': null,
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122},
                                {'type': 'character', 'value': 34},
                                {'type': 'range', 'from': 43, 'to': 45}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept unicode escapes', () => {
        expect(parse('entry [(\\u0001 - z except h - g, \\u0003 - \\u00a2)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': null,
                            'included': [
                                {'type': 'range', 'from': 1, 'to': 122}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104},
                                {'type': 'range', 'from': 3, 'to': 162}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should support multipliers', () => {
        expect(parse('entry [(a-z){1,3}]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'multiplier': {
                                'type': 'range',
                                'value': {
                                    'start': 1,
                                    'end': 3
                                }
                            },
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122}
                            ],
                            'excluded': []
                        }
                    ]
                }
            }
        ]);
    });

    failAll([
        'entry [(',
        'entry [(a - )]',
        'entry [(a - \\a)]',
        'entry [(a - \\"a)]',
        'entry [(a - \\',
        'entry [(a - ")]',
        'entry [(a - z except)]',
        'entry [(a - z a except b)]',
        'entry [(except a)]',
        'entry [(a - z]',
        'entry [(\\u123l - z)]',
        'entry [(\\u12322 - z)]'
    ]);
});
