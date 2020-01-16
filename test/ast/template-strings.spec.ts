import {failAll} from './tools';

describe('[AST] Template strings', () => {

    failAll([
        '[\'{\']',
        '[\'{[]}\']',
        '[\'{}\']',
        '[\'{3}\']',
        '[\'{$val} {\']'
    ]);
});
