import {failAll} from './tools';

describe('[AST] Arguments', () => {

    failAll([
        'entry <sup nice=>',
        'entry <sup nice>'
    ]);
});
