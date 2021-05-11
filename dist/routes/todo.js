"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // this will help us to use routers.
const todo_1 = require("../controller/todo");
const router = express_1.Router();
router.post('/createUser', todo_1.createUser);
router.post('/createBills', todo_1.billings);
//
router.get('/bills/:id', todo_1.getBillingDetails);
//
// router.delete('/:id',deleteTodo);
exports.default = router;
