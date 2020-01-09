import {failAll} from './tools';

describe('[AST] Operations', () => {

    failAll([
        '<abc> = [push]',
        '<abc> = [def]',
        '<abc> = [def s]',
        '<abc> = [def s = ]',
        '<abc> = [def s = abc]',
    ]);
});
