"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_route_1 = require("./routes/client/index.route");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const database_1 = __importDefault(require("./config/database"));
(0, database_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
(0, index_route_1.routeApi)(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
