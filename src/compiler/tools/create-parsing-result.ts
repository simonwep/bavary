import {ParsingResult} from '../types';

export const createParsingResult = (name: 'string' | 'array' | 'object'): ParsingResult => {
    switch (name) {
        case 'array':
            return {
                type: 'array',
                value: []
            };
        case 'object':
            return {
                type: 'object',
                value: {}
            };
        case 'string':
            return {
                type: 'string',
                value: ''
            };
    }
};
