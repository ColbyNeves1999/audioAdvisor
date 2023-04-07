"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Artist = void 0;
var typeorm_1 = require("typeorm");
var Group_1 = require("./Group");
var Artist = /** @class */ (function () {
    function Artist() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Artist.prototype, "artistID");
    __decorate([
        (0, typeorm_1.Column)()
    ], Artist.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)()
    ], Artist.prototype, "songID");
    __decorate([
        (0, typeorm_1.Column)()
    ], Artist.prototype, "userID");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return Group_1.Group; }, function (group) { return group.members; }, { cascade: ['insert', 'update'] }),
        (0, typeorm_1.JoinTable)()
    ], Artist.prototype, "groups");
    Artist = __decorate([
        (0, typeorm_1.Entity)()
    ], Artist);
    return Artist;
}());
exports.Artist = Artist;
