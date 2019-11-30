import {failAll} from './tools';

describe('[AST] Types', () => {

    failAll([
        '<> = ["A"]',
        '<abc> = ["A" | <>]',
        '<abc> = [...<a#b>]',
        '<abc> = ["A" | <a:b:>]'
    ]);
});
