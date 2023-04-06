"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.callBack = exports.spotifyLogin = void 0;
var querystring_1 = require("querystring");
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI = process.env.REDIRECT_URI;
var stateKey = 'spotify_auth_state';
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
// Spotify login
function spotifyLogin(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    var myObj = {
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    };
    var myJSON = querystring_1["default"].stringify(myObj);
    res.redirect("https://accounts.spotify.com/authorize?".concat(myJSON));
}
exports.spotifyLogin = spotifyLogin;
function callBack(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var code, state, myObj, myJSON, fetchResponse, resJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = req.query.code || null;
                    state = req.query.state || null;
                    if (!(state === null)) return [3 /*break*/, 1];
                    res.redirect("/#".concat(querystring_1["default"].stringify({
                        error: 'state_mismatch'
                    })));
                    return [3 /*break*/, 4];
                case 1:
                    res.clearCookie(stateKey);
                    myObj = {
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: REDIRECT_URI,
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET
                    };
                    myJSON = querystring_1["default"].stringify(myObj);
                    return [4 /*yield*/, fetch('https://accounts.spotify.com/api/token', {
                            method: 'POST',
                            body: myJSON,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 2:
                    fetchResponse = _a.sent();
                    return [4 /*yield*/, fetchResponse.json()];
                case 3:
                    resJson = _a.sent();
                    // thisToken = resJson.access_token;
                    console.log(resJson);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.callBack = callBack;
