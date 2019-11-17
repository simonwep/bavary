import chalk from 'chalk';

export enum LEVEL {
    ERROR = 'ERROR',
    WARN = 'WARN',
    OK = 'OK',
    INFO = 'INFO'
}

const colorMap = {
    [LEVEL.ERROR]: 'red',
    [LEVEL.WARN]: 'yellow',
    [LEVEL.OK]: 'greenBright',
    [LEVEL.INFO]: 'blueBright',
};

/* eslint-disable no-console */
export function log(msg: string, level: LEVEL = LEVEL.INFO): void {
    const color = colorMap[level];
    console.log(chalk`{${color} [${level}]} ${msg}`);
}
