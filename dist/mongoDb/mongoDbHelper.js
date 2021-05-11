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
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDbHelper {
    constructor() {
        this.name = "mongodb://localhost/mongotube";
    }
    // handling multiple connection....
    createConnection(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield mongoose_1.default.createConnection(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
            mongoose_1.default.connection
                .once("open", () => console.log("Connected"))
                .on("error", (error) => {
                console.log("Error While Connecting ", error);
            });
            return db;
        });
    }
    createSingleConnection(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
            mongoose_1.default.connection
                .once("open", () => console.log("Connected"))
                .on("error", (error) => {
                console.log("Error While Connecting ", error);
            });
        });
    }
}
exports.default = MongoDbHelper;
