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
exports.getBillingDetails = exports.billings = exports.createUser = exports.createConnection = void 0;
// which is similar to importing this import express , { Request, Response, NextFunction } from 'express'.
// RequestHandler is a type.
const userSchema_1 = require("../mongoDb/userSchema");
const billingSchema_1 = require("../mongoDb/billingSchema");
const joi_1 = __importDefault(require("joi"));
const mongoDbHelper_1 = __importDefault(require("../mongoDb/mongoDbHelper"));
const customValidate = (value, helpers) => {
    if (value.toString().length !== 10) {
        console.log("FROM PHONE ", value.toString().length);
        return helpers.error('any.invalid');
    }
    return value;
};
const inputValidate = (obj) => {
    var _a, _b, _c;
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.number().custom(customValidate).required(),
        balance: joi_1.default.number().custom((value, helpers) => {
            if (!(value >= 1000 && value <= 5000)) {
                console.log("FROM BALANCE ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
        street: joi_1.default.string().min(5).required(),
        city: joi_1.default.string().min(5).required(),
        postCode: joi_1.default.number().custom((value, helpers) => {
            if (value.toString().length !== 6) {
                console.log("FROM postCode ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
    });
    return schema.validate({
        name: obj.name, email: obj.email, phone: obj.phone, balance: obj.balance,
        street: (_a = obj.address) === null || _a === void 0 ? void 0 : _a.street, city: (_b = obj.address) === null || _b === void 0 ? void 0 : _b.city, postCode: (_c = obj.address) === null || _c === void 0 ? void 0 : _c.postCode
    }, { convert: false });
};
const billingValidate = (obj) => {
    const schema = joi_1.default.object({
        amount: joi_1.default.number().custom((value, helpers) => {
            if (!(value >= 1000 && value <= 5000)) {
                console.log("FROM BALANCE ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
        billingType: joi_1.default.string().custom((value, helpers) => {
            if (value === "Account" || value === "Transaction") {
                return value;
            }
            else {
                return helpers.error('any.invalid');
            }
        }),
        userId: joi_1.default.string(),
    });
    return schema.validate({ amount: obj.amount, billingType: obj.billingType, userId: obj.userId }, { convert: false });
};
const createConnection = (dbName) => __awaiter(void 0, void 0, void 0, function* () {
    let mongodb = new mongoDbHelper_1.default();
    let obj;
    yield mongodb.createConnection(`mongodb://localhost/${dbName}`).then(value => {
        console.log(`Connection to ${dbName} Successfully established..`);
        obj = value;
        //localStorage.setItem("UsersDb",value)
    }).catch((err) => {
        console.log(`Error while connecting to ${dbName}...`, err);
    });
    return obj;
});
exports.createConnection = createConnection;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield exports.createConnection('Users');
    const User = db.model('User', userSchema_1.UserSchema);
    const data = req.body;
    let flag = false;
    let errorMe = "";
    //console.log(typeof (data.phone));
    let user = new User(Object.assign({}, data));
    if (typeof (data.phone) === "number" && typeof (data.balance) === "number" && typeof (data.address.postCode) === "number") {
        const { error, value } = inputValidate(user);
        if (error) {
            flag = true;
            errorMe = error.message;
        }
        else {
            yield user.save().then((value1) => {
            }).catch((err) => {
                console.log("ERR during saving user ", err.message);
                flag = true;
                errorMe = err.message;
            });
        }
    }
    else {
        flag = true;
        errorMe = {
            phone: "May Have Wrong type",
            balance: "May Have Wrong type",
            postalCode: "May Have Wrong type"
        };
    }
    if (flag) {
        res.status(400).json({ error: errorMe });
        res.end();
    }
    else {
        res.status(200).send(user);
    }
});
exports.createUser = createUser;
const billings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield exports.createConnection('Bills');
    const BillingStruct = db.model('Bills', billingSchema_1.BillingSchema);
    const data = req.body;
    let flag = false;
    let errorMe = "";
    data['date'] = Date.now();
    let bills = new BillingStruct(Object.assign({}, data));
    if (typeof (data.amount) === "number" && typeof (data.billingType) === "string" && typeof (data.userId) === "string") {
        const { error, value } = billingValidate(bills);
        if (error) {
            flag = true;
            errorMe = error.message;
        }
        else {
            yield bills.save().then((value1) => {
            }).catch((err) => {
                console.log("ERR during saving Bills ", err.message);
                flag = true;
                errorMe = err.message;
            });
        }
    }
    else {
        flag = true;
        errorMe = {
            amount: "May Have Wrong type",
            userId: "May Have Wrong type",
            billingType: "May Have Wrong type"
        };
    }
    if (flag) {
        res.status(400).json({ error: errorMe });
        res.end();
    }
    else {
        res.status(200).send(bills);
    }
});
exports.billings = billings;
const getBillingDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    const db = yield exports.createConnection('Bills');
    const BillingStruct = db.model('Bills', billingSchema_1.BillingSchema);
    let flag = false;
    let arr = [];
    let errorMe = "";
    let response = "";
    yield BillingStruct.find({ userId: id.toString() }).then((it) => {
        if (it.length < 0) {
            response = "No bills found this User....";
        }
        else {
            response = `${it.length} records found for this User`;
            arr = it;
        }
    }).catch((err) => {
        flag = true;
        errorMe = err;
    });
    if (flag) {
        res.status(400).json({ error: errorMe });
        res.end();
    }
    else {
        res.status(200).send({ result: arr, message: response });
    }
});
exports.getBillingDetails = getBillingDetails;
// import {Todo} from '../models/todo';
//
// const TODOS: Todo[] = [];
//
// // using interface with function...createTodo function is a type of RequestHandler which has 3 params req,res and next function.
// export const createTodo: RequestHandler = (req, res,
//                                            next) => {
//     console.log(req.body);
//     const text = (req.body as { text: string }).text; // we are type casting our req.body as object which has text of type string.
//     const newTodo = new Todo(Math.random().toString(), text);
//
//     TODOS.push(newTodo);
//
//     res.status(200).json({message: 'Created the todo.', createdTodo: newTodo});
// };
//
//
// export const getTodos: RequestHandler = (req, res,
//                                          next) => {
//     res.json({todos: TODOS});
// };
//
// // RequestHandler<{ id: string }> is making use generic which is telling that we have id in our url of type string
// export const updateTodo: RequestHandler<{ id: string }> = (req, res
//                                                            , next) => {
//     const todoId = req.params.id;
//
//     const updatedText = (req.body as { text: string }).text;
//
//     const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
//
//     if (todoIndex < 0) {
//         throw new Error('Could not find todo!'); // if id is not found throw error.
//     }
//
//     TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, updatedText);
//
//     res.json({message: 'Updated!', updatedTodo: TODOS[todoIndex]});
// };
//
// export const deleteTodo: RequestHandler = (req, res,
//                                            next) => {
//     const todoId = req.params.id;
//
//     const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
//
//     if (todoIndex < 0) {
//         throw new Error('Could not find todo!');
//     }
//
//     TODOS.splice(todoIndex, 1); // splice will delete one element from given index.
//
//     res.json({message: 'Todo deleted!'});
// };
