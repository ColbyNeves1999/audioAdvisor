"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AvatarPhoto = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var AvatarPhoto = /** @class */ (function () {
    function AvatarPhoto() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], AvatarPhoto.prototype, "avatarPhotoId");
    __decorate([
        (0, typeorm_1.Column)()
    ], AvatarPhoto.prototype, "imgPath");
    __decorate([
        (0, typeorm_1.Column)()
    ], AvatarPhoto.prototype, "fileSize");
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return User_1.User; }, function (user) { return user.avatarPhoto; })
    ], AvatarPhoto.prototype, "user");
    AvatarPhoto = __decorate([
        (0, typeorm_1.Entity)()
    ], AvatarPhoto);
    return AvatarPhoto;
}());
exports.AvatarPhoto = AvatarPhoto;
