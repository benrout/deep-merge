const isMergeableObject = val => {
    return val && typeof val === "object" && Object.prototype.toString.call(val) !== "[object Date]" && Object.prototype.toString.call(val) !== "[object RegExp]";
};

const emptyTarget = val => {
    return Array.isArray(val) ? [] : {};
};

const propertyIsUnsafe = (target, key) => {
    return key in target
        && !Object.prototype.hasOwnProperty.call(target, key)
        && !Object.prototype.propertyIsEnumerable.call(target, key);
};

const clone = val => {
    return isMergeableObject(val) ? deepmerge(emptyTarget(val), val) : val;
}

const deepmerge = (target, source) => {
    const targetIsArray = Array.isArray(target);
    const sourceIsArray = Array.isArray(source);
    const sourceAndTargetTypesMatch = targetIsArray === sourceIsArray;

    if (!sourceAndTargetTypesMatch) {
        return clone(source);
    }
    else if (sourceIsArray) {
        return mergeArray(target, source);
    }
    else {
        return mergeObject(target, source);
    }
}

const mergeArray = (target, source) => {
    return target.concat(source).map(el => {
        return clone(el);
    });
};

const mergeObject = (target, source) => {
    const result = {};

    if (isMergeableObject(target)) {
        const targetKeys = Object.keys(target);
        for (const key of targetKeys) {
            result[key] = clone(target[key]);
        }
    };

    const sourceKeys = Object.keys(source);
    for (const key of sourceKeys) {
        if (propertyIsUnsafe(target, key)) {
            return;
        }

        if (key in target && isMergeableObject(source[key])) {
            result[key] = deepmerge(target[key], source[key]);
        } else {
            result[key] = clone(source[key]);
        }
    }

    return result;
};