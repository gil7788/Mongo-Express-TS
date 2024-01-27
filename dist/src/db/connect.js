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
exports.closeConnection = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const connectionString = "mongodb://localhost:27017";
const client = new mongodb_1.MongoClient(connectionString);
let db;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (db) {
            return db;
        }
        try {
            yield client.connect();
            console.log("Connected successfully to the database");
            db = client.db("sample_training");
            return db;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
}
exports.connect = connect;
function closeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.close();
    });
}
exports.closeConnection = closeConnection;
