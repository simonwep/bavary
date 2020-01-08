import {failAll} from './tools';

describe('[AST] Modifiers', () => {

    failAll([
        'entry [parse($)]',
        'entry [parse(asda,)]',
        'entry [parse(<par)]'
    ]);
});
