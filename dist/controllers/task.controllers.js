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
exports.deleteTask = exports.update = exports.create = exports.changeStatus = exports.detail = exports.index = void 0;
const task_models_1 = __importDefault(require("../models/task.models"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    if (req.query["status"]) {
        find["status"] = req.query["status"];
    }
    const sort = {};
    const sortKey = `${req.query["sortKey"]}`;
    const sortValue = `${req.query["sortValue"]}`;
    if (req.query["sortKey"] && req.query["sortValue"]) {
        sort[sortKey] = sortValue;
    }
    const page = parseInt(`${req.query['page']}`) || 1;
    const limitItems = parseInt(`${req.query['limitItems']}`) || 3;
    const skip = (page - 1) * limitItems;
    if (req.query['keyword']) {
        const regex = new RegExp(`${req.query['keyword']}`, 'i');
        find['title'] = regex;
    }
    const tasks = yield task_models_1.default
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield task_models_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    }
    catch (_a) {
        res.json({
            message: "Task không hợp lệ"
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusType = ['initial', 'doing', 'finish', 'not finish'];
        const status = statusType.includes(req.body['status']) ? req.body['status'] : 'inital';
        const ids = req.body['ids'];
        yield task_models_1.default.updateMany({
            _id: {
                $in: ids
            }
        }, {
            status: status
        });
        res.json({
            code: 200,
            message: "Cập nhật thành công "
        });
    }
    catch (_a) {
        res.json({
            code: 400
        });
    }
});
exports.changeStatus = changeStatus;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.createdBy = req['user']._id;
        const task = req.body;
        const newTask = new task_models_1.default(task);
        yield newTask.save();
        res.json({
            id: newTask._id,
            message: "Thêm Task thành công"
        });
    }
    catch (_a) {
        res.json({
            message: "Thêm Task thất bại"
        });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body._id;
        yield task_models_1.default.updateOne({
            _id: id
        }, req.body);
    }
    catch (_a) {
        res.json({
            message: "Cập nhật Task thất bại"
        });
    }
});
exports.update = update;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body;
        for (const id of ids) {
            const checkTask = yield task_models_1.default.findOne({
                _id: id
            });
        }
        yield task_models_1.default.updateMany({
            _id: {
                $in: ids
            }
        }, {
            deleted: true
        });
    }
    catch (_a) {
        res.json({
            message: "Xóa Task Thất bại"
        });
    }
});
exports.deleteTask = deleteTask;
