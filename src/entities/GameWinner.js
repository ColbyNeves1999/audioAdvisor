"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GameWinner = void 0;
var typeorm_1 = require("typeorm");
var GameWinner = /** @class */ (function () {
    function GameWinner() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], GameWinner.prototype, "userID");
    __decorate([
        (0, typeorm_1.Column)()
    ], GameWinner.prototype, "songID");
    __decorate([
        (0, typeorm_1.Column)()
    ], GameWinner.prototype, "libraryID");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], GameWinner.prototype, "gamesPlayed");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], GameWinner.prototype, "gamesWon");
    GameWinner = __decorate([
        (0, typeorm_1.Entity)()
    ], GameWinner);
    return GameWinner;
}());
exports.GameWinner = GameWinner;
