"use strict";
// npm i --save-dev @types/node... to install all node types
// then install @types/express also...in order to use specific type sin express, just like we did with lodash.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const todo_js_1 = __importDefault(require("./routes/todo.js")); // we are exporting our default route
const body_parser_1 = require("body-parser"); // using body parser as middleware
const mongoDbHelper_js_1 = __importDefault(require("./mongoDb/mongoDbHelper.js"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.json()); // will parse incoming request.
//app.use('/todos', todoRoutes); // this will send all request to routes that are /todos
app.use('/billingApp', todo_js_1.default);
// Error handling middleware that will run if any other middleware have some error
//  This function is executed every time the app receives a request.
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(3000, () => {
    let mongodb = new mongoDbHelper_js_1.default();
    // mongodb.createConnection("mongodb://localhost/Users").then(value => {
    //     console.log("Connection 1 Successfully established..");
    //     //localStorage.setItem("UsersDb",value)
    // }).catch((err) => {
    //    console.log("Error while connecting 1...",err);
    // });
    // mongodb.createConnection("mongodb://localhost/Bills").then(value => {
    //     console.log("Connection 2 Successfully established..")
    // }).catch((err) => {
    //    console.log("Error while connecting 2...",err);
    // });
    // console.log(`Listening on port 3000...`);
});
