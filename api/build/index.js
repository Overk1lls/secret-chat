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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./middleware/app");
const socket_service_1 = require("./services/socket.service");
const mongodb_service_1 = require("./services/mongodb.service");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { PORT, MONGO_URI } = process.env;
const app = (0, app_1.createApp)();
const server = new socket_service_1.SocketServer(app, parseInt(PORT));
const mongodb = new mongodb_service_1.MongoDbConnection(MONGO_URI);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongodb.connect();
    yield server.setup();
});
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
