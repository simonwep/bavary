module.exports = vals => {
    const stashed = [];
    let index = 0;

    return {
        stash: () => stashed.push(index),
        pop: () => index = stashed.pop(),
        next: () => vals[index++],
        peek: () => vals[index],
        hasNext: () => index < vals.length
    };
};
