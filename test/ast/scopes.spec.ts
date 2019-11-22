const {parse} = require('./tools');
import {expect} from 'chai';

describe('[AST] Scopes', () => {

    it('Should allow a block as entry type', () => {
        expect(parse(`
            entry <a> = {
                default <b> = ["A"]
            }
        `)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'block',
                    'value': [
                        {
                            'type': 'declaration',
                            'name': 'b',
                            'variant': 'default',
                            'value': {
                                'type': 'group',
                                'multiplier': null,
                                'value': [
                                    {
                                        'type': 'string',
                                        'value': 'A'
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);
    });

    it('Should allow nested scopes', () => {
        expect(parse(`
            entry <a> = {
                default <b> = {
                    default <c> = ["C"]
                }
            }
        `)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'block',
                    'value': [
                        {
                            'type': 'declaration',
                            'name': 'b',
                            'variant': 'default',
                            'value': {
                                'type': 'block',
                                'value': [
                                    {
                                        'type': 'declaration',
                                        'name': 'c',
                                        'variant': 'default',
                                        'value': {
                                            'type': 'group',
                                            'multiplier': null,
                                            'value': [
                                                {
                                                    'type': 'string',
                                                    'value': 'C'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);
    });
});
