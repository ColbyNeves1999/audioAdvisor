"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var AvatarPhoto_1 = require("./AvatarPhoto");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], User.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], User.prototype, "passwordHash");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], User.prototype, "verifiedEmail");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "profileViews");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], User.prototype, "spotifyAuth");
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return AvatarPhoto_1.AvatarPhoto; }, function (avatarPhoto) { return avatarPhoto.user; }),
        (0, typeorm_1.JoinColumn)()
    ], User.prototype, "avatarPhoto");
    User = __decorate([
        (0, typeorm_1.Entity)()
    ], User);
    return User;
}());
exports.User = User;
