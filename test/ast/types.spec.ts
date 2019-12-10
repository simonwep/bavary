import {failAll} from './tools';

describe('[AST] Types', () => {

    failAll([
        '<> = ["A"]',
        '<abc>',
        '<abc> = ["A" | <>]',
        '<ab- c> = ["A"]',
        '<-ab c> = ["A"]',
        '<abc> = [...<a#b>]',
        '<abc> = ["A" | <a:b:>]',
        'entry <sup> = '
    ]);
});
