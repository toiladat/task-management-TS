"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeApi = void 0;
const task_route_1 = require("./task.route");
const user_route_1 = require("./user.route");
const auth_middlewares_1 = require("../../middlewares/client/auth.middlewares");
const routeApi = (app) => {
    app.use('/tasks', auth_middlewares_1.requireAuth, task_route_1.taskRoute);
    app.use('/user', user_route_1.userRoute);
};
exports.routeApi = routeApi;
