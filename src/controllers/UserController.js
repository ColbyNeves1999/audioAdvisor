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
exports.logIn = exports.registerUser = void 0;
var argon2_1 = require("argon2");
var date_fns_1 = require("date-fns");
var UserModel_1 = require("../models/UserModel");
var db_utils_1 = require("../utils/db-utils");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, passwordHash, newUser, err_1, databaseErrorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, argon2_1["default"].hash(password)];
                case 1:
                    passwordHash = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, UserModel_1.addUser)(email, passwordHash)];
                case 3:
                    newUser = _b.sent();
                    console.log(newUser);
                    res.sendStatus(201);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.error(err_1);
                    databaseErrorMessage = (0, db_utils_1.parseDatabaseError)(err_1);
                    res.status(500).json(databaseErrorMessage);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.registerUser = registerUser;
// async function logIn(req: Request, res: Response): Promise<void> {
//   const { email, password } = req.body as AuthRequest;
//   const user = await getUserByEmail(email);
//   // Check if the user account exists for that email
//   if (!user) {
//     res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
//     return;
//   }
//   // The account exists so now we can check their password
//   const { passwordHash } = user;
//   // If the password does not match
//   if (!(await argon2.verify(passwordHash, password))) {
//     res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
//     return;
//   }
//   // The user has successfully logged in
//   // NOTES: We will update this once we implement session management
//   res.sendStatus(200); // 200 OK
// }
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var now, logInTimeout, timeRemaining, message, _a, email, password, user, passwordHash, threeMinutesLater;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log(req.session);
                    now = new Date();
                    logInTimeout = (0, date_fns_1.parseISO)(req.session.logInTimeout);
                    // NOTES: If the client has a timeout set and it has not expired
                    if (logInTimeout && (0, date_fns_1.isBefore)(now, logInTimeout)) {
                        timeRemaining = (0, date_fns_1.formatDistanceToNow)(logInTimeout);
                        message = "You have ".concat(timeRemaining, " remaining.");
                        // NOTES: Reject their request
                        res.status(429).send(message); // 429 Too Many Requests
                        return [2 /*return*/];
                    }
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, (0, UserModel_1.getUserByEmail)(email)];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        res.sendStatus(404); // 404 Not Found - email doesn't exist
                        return [2 /*return*/];
                    }
                    passwordHash = user.passwordHash;
                    return [4 /*yield*/, argon2_1["default"].verify(passwordHash, password)];
                case 2:
                    if (!(_b.sent())) {
                        // NOTES: If they haven't attempted to log in yet
                        if (!req.session.logInAttempts) {
                            req.session.logInAttempts = 1; // NOTES: Set their attempts to one
                        }
                        else {
                            req.session.logInAttempts += 1; // NOTES: Otherwise increment their attempts
                        }
                        // NOTES: If the client has failed five times then we will add a
                        //        3 minute timeout
                        if (req.session.logInAttempts >= 5) {
                            threeMinutesLater = (0, date_fns_1.addMinutes)(now, 3).toISOString();
                            req.session.logInTimeout = threeMinutesLater;
                            req.session.logInAttempts = 0; // NOTES: Reset their attempts
                        }
                        res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
                        return [2 /*return*/];
                    }
                    // NOTES: Remember to clear the session before setting their authenticated session data
                    return [4 /*yield*/, req.session.clearSession()];
                case 3:
                    // NOTES: Remember to clear the session before setting their authenticated session data
                    _b.sent();
                    // NOTES: Now we can add whatever data we want to the session
                    req.session.authenticatedUser = {
                        userId: user.userId,
                        email: user.email
                    };
                    req.session.isLoggedIn = true;
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
exports.logIn = logIn;
