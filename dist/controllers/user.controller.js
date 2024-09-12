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
exports.profile = exports.resetPassword = exports.typeOtp = exports.forgot = exports.login = exports.register = void 0;
const sendEmail_helper_1 = require("./../helper/sendEmail.helper");
const user_models_1 = __importDefault(require("../models/user.models"));
const generate_helper_1 = require("../helper/generate.helper");
const md5_1 = __importDefault(require("md5"));
const forgot_password_models_1 = __importDefault(require("../models/forgot-password.models"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_models_1.default.findOne({
        email: req.body.email
    });
    if (existUser) {
        res.json({
            message: "Email đã tồn tại",
            code: 400
        });
        return;
    }
    const token = (0, generate_helper_1.generateRandomString)(32);
    const dataUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: (0, md5_1.default)(req.body.password),
        token: token
    };
    const newUser = new user_models_1.default(dataUser);
    yield newUser.save();
    res.json({
        code: 200,
        message: "Đăng ký thành công",
        token: token
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const existUser = yield user_models_1.default.findOne({
        email: email
    });
    if (!existUser) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        });
        return;
    }
    if (existUser.password != (0, md5_1.default)(password)) {
        res.json({
            code: 400,
            message: "Password Không đúng "
        });
        return;
    }
    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: existUser.token
    });
});
exports.login = login;
const forgot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body['email'];
    console.log(email);
    const existUser = yield user_models_1.default.findOne({
        email: email
    });
    if (!existUser) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        });
        return;
    }
    const otp = (0, generate_helper_1.generateRandomNumber)(6);
    const forgotData = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
    };
    const forgotPassword = new forgot_password_models_1.default(forgotData);
    yield forgotPassword.save();
    const subject = "Mã OTP lấy lại mật khẩu";
    const htmls = `<p>Mã OTP là <b style="color:red">${otp}</b>. Có hiệu lực trong 3 phút </p>`;
    (0, sendEmail_helper_1.sendEmail)(email, subject, htmls);
    res.json({
        code: 200,
        message: "Đã gửi mã OTP"
    });
});
exports.forgot = forgot;
const typeOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield forgot_password_models_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        res.json({
            code: 400,
            message: "Otp không hợp lệ"
        });
        return;
    }
    const user = yield user_models_1.default.findOne({
        email: email,
        deleted: false
    }).select('token');
    res.json({
        code: 200,
        token: user.token
    });
});
exports.typeOtp = typeOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    const user = yield user_models_1.default.findOne({
        token: token,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Cập nhật mật khẩu thất bại"
        });
        return;
    }
    yield user_models_1.default.updateOne({
        token: token,
        deleted: false
    }, {
        password: (0, md5_1.default)(password)
    });
    res.json({
        code: 200,
        message: "Cập nhật mật khẩu thành công"
    });
});
exports.resetPassword = resetPassword;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.default.findOne({
        token: req['tokenVerify'],
        deleted: false
    }).select('-password -token');
    res.json({
        code: 200,
        user: user
    });
});
exports.profile = profile;
