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
exports.addNewSong = exports.getSongsGenera = exports.getArtistSongs = exports.getSongTitle = exports.getSong = exports.getSongsFromYear = exports.getAlbum = void 0;
var SongModel_1 = require("../models/SongModel");
function getAlbum(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var album, albumName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    album = req.body.album;
                    return [4 /*yield*/, (0, SongModel_1.getSongByAlbum)(album)];
                case 1:
                    albumName = _a.sent();
                    if (!albumName) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    console.log(albumName);
                    res.sendStatus(200); // 200 OK
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAlbum = getAlbum;
function getSongsFromYear(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var releaseYear, yearReleased;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    releaseYear = req.body.releaseYear;
                    return [4 /*yield*/, (0, SongModel_1.getSongsByYear)(releaseYear)];
                case 1:
                    yearReleased = _a.sent();
                    if (!yearReleased) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.getSongsFromYear = getSongsFromYear;
function getSong(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var songID, songId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    songID = req.body.songID;
                    return [4 /*yield*/, (0, SongModel_1.getSongbyID)(songID)];
                case 1:
                    songId = _a.sent();
                    if (!songId) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.getSong = getSong;
function getSongTitle(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var songTitle, title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    songTitle = req.body.songTitle;
                    return [4 /*yield*/, (0, SongModel_1.getSongbyTitle)(songTitle)];
                case 1:
                    title = _a.sent();
                    if (!title) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.getSongTitle = getSongTitle;
function getArtistSongs(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var artist, artistSongs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    artist = req.body.artist;
                    return [4 /*yield*/, (0, SongModel_1.getSongbyArtist)(artist)];
                case 1:
                    artistSongs = _a.sent();
                    if (!artistSongs) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.getArtistSongs = getArtistSongs;
function getSongsGenera(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var genera, generaSongs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    genera = req.body.genera;
                    return [4 /*yield*/, (0, SongModel_1.getSongbyGenera)(genera)];
                case 1:
                    generaSongs = _a.sent();
                    if (!generaSongs) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.getSongsGenera = getSongsGenera;
function addNewSong(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, songTitle, artist, album, genera, releaseYear, newSong;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, songTitle = _a.songTitle, artist = _a.artist, album = _a.album, genera = _a.genera, releaseYear = _a.releaseYear;
                    return [4 /*yield*/, (0, SongModel_1.addSong)(songTitle, artist, album, genera, releaseYear)];
                case 1:
                    newSong = _b.sent();
                    if (!newSong) {
                        res.sendStatus(404); // 404 Not Found
                        return [2 /*return*/];
                    }
                    res.sendStatus(200); // 200 Ok
                    return [2 /*return*/];
            }
        });
    });
}
exports.addNewSong = addNewSong;
