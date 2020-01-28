import {failAll} from './tools';

describe('[AST] Types', () => {

    failAll([
        '<> = ["A"]',
        '<abc>',
        '<abc> = ["A" | <>]',
        '<ab- c> = ["A"]',
        '<-ab c> = ["A"]',
        '<abc> = ["A" | <a:b:>]',
        'entry <sup> = ',
        'entry {}',
        'entry {hi}'
    ]);
});
