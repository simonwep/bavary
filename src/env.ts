declare const VERSION: string;

// Current version
/* istanbul ignore next */
export const ENV_VERSION = typeof VERSION === 'undefined' ? 'unknown' : VERSION;
