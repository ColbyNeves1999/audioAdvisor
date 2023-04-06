"use strict";
exports.__esModule = true;
exports.parseDatabaseError = void 0;
var typeorm_1 = require("typeorm");
function parseDatabaseError(err) {
    var _a, _b, _c, _d, _e, _f;
    if (!(err instanceof typeorm_1.QueryFailedError)) {
        return { type: 'unknown', message: 'An unknown database error has occurred.' };
    }
    var driverErrorString = err.driverError.toString();
    if (driverErrorString.includes('UNIQUE')) {
        var columnName = (_c = (_b = (_a = driverErrorString === null || driverErrorString === void 0 ? void 0 : driverErrorString.split(':')) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.split('.').at(-1)) !== null && _c !== void 0 ? _c : '';
        return { type: 'unique', columnName: columnName, message: "The '".concat(columnName, "' property must be unique.") };
    }
    if (driverErrorString.includes('NOT NULL')) {
        var columnName = (_f = (_e = (_d = driverErrorString === null || driverErrorString === void 0 ? void 0 : driverErrorString.split(':')) === null || _d === void 0 ? void 0 : _d.at(-1)) === null || _e === void 0 ? void 0 : _e.split('.').at(-1)) !== null && _f !== void 0 ? _f : '';
        return {
            type: 'not null',
            columnName: columnName,
            message: "The '".concat(columnName, "' property must not be null.")
        };
    }
    if (driverErrorString.includes('CHECK')) {
        return { type: 'check', message: "Failed a check constraint." };
    }
    return { type: 'unknown', message: 'An unknown database error has occurred.' };
}
exports.parseDatabaseError = parseDatabaseError;
