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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const user_models_1 = __importDefault(require("../../models/user.models"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token"
        });
        return;
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token"
        });
        return;
    }
    const user = yield user_models_1.default.findOne({
        token: token,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Tài khoản chưa tồn tại"
        });
        return;
    }
    req["tokenVerify"] = token;
    req['user'] = user;
    next();
});
exports.requireAuth = requireAuth;
