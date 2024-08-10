function checkFormat(a: string): boolean {
    const re1 = /^([1-9]\\d*)|(\\d+\\.\\d*[1-9])$/i;
    if (a.match(re1) == null) return false;
    return true;
}

function alignDecimals(a: string, b: string): [string, string] {
    if (a.indexOf('.') == -1 && b.indexOf('.') == -1) {
        return [a, b];
    }

    const afrac = (a.indexOf('.') == -1) ? 1 : (a.length - a.indexOf('.'));
    const bfrac = (b.indexOf('.') == -1) ? 1 : (b.length - b.indexOf('.'));
    if (afrac < bfrac) {
        // append 0 to a
        for (let i = afrac; i < bfrac; i++) a += '0';
    } else {
        // append 0 to b
        for (let i = bfrac; i < afrac; i++) b += '0';
    }

    const re2 = new RegExp('^0*([1-9]?\\d*)\\.(\\d+)$', 'i');
    a = a.replace(re2, function(x, y, z) {
        return y + z;
    });
    b = b.replace(re2, function(x, y, z) {
        return y + z;
    });
    // remove leading zeros
    const re3 = new RegExp('^0*([1-9]\\d*)$', 'i');
    a = a.replace(re3, function(x, y) {
        return y;
    });
    b = b.replace(re3, function(x, y) {
        return y;
    });
    return [a, b];
}

function checkOverflow(a: string, precision: number): boolean {
    if (a.length > precision) return true;
    return false;
}

type mode_t = {
    show_stroke: boolean,
    flag_replace: boolean,
};

const default_mode: mode_t = {
    show_stroke: true,
    flag_replace: false,
};


export {checkFormat, alignDecimals, checkOverflow, default_mode, mode_t};