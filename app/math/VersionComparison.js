const versionArrayFromString = (version) => {
    const array = version.split('.');
    while (array.length < 3) {
        array.push(0);
    }
    return array;
};

export const isVersionLessThanOrEqual = (version, compare) => {
    version = versionArrayFromString(version);
    compare = versionArrayFromString(compare);
    if (version[0] > compare[0]) {
        return false;
    } else if (version[0] < compare[0]) {
        return true;
    }
    if (version[1] > compare[1]) {
        return false;
    } else if (version[1] < compare[1]) {
        return true;
    }
    if (version[2] > compare[2]) {
        return false;
    } else if (version[2] < compare[2]) {
        return true;
    }

    // full equal
    return true;
};

export const isVersionGreaterThanOrEqual = (version, compare) => {
    version = versionArrayFromString(version);
    compare = versionArrayFromString(compare);
    if (version[0] < compare[0]) {
        return false;
    } else if (version[0] > compare[0]) {
        return true;
    }
    if (version[1] < compare[1]) {
        return false;
    } else if (version[1] > compare[1]) {
        return true;
    }
    if (version[2] < compare[2]) {
        return false;
    } else if (version[2] > compare[2]) {
        return true;
    }

    // full equal
    return true;
};

export const isVersionGreaterThan = (version, compare) => {
    version = versionArrayFromString(version);
    compare = versionArrayFromString(compare);
    if (version[0] < compare[0]) {
        return false;
    } else if (version[0] > compare[0]) {
        return true;
    }
    if (version[1] < compare[1]) {
        return false;
    } else if (version[1] > compare[1]) {
        return true;
    }
    if (version[2] < compare[2]) {
        return false;
    } else if (version[2] > compare[2]) {
        return true;
    }

    // full equal
    return false;
};
