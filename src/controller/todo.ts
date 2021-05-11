import {RequestHandler} from 'express'; // as we have used @types/express so we can use RequestHandler
// which is similar to importing this import express , { Request, Response, NextFunction } from 'express'.
// RequestHandler is a type.
import {IUser, Address, UserSchema} from "../mongoDb/userSchema";
import {BillingSchema, BillingInterface} from "../mongoDb/billingSchema";
import Joi, {LanguageMessages} from 'joi';
import MongoDbHelper from "../mongoDb/mongoDbHelper";

const customValidate = (value: string, helpers: any) => {
    if (value.toString().length !== 10) {
        console.log("FROM PHONE ", value.toString().length);
        return helpers.error('any.invalid');
    }
    return value;
}

const inputValidate = (obj: IUser) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().custom(customValidate).required(),
        balance: Joi.number().custom((value, helpers) => {
            if (!(value >= 1000 && value <= 5000)) {
                console.log("FROM BALANCE ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
        street: Joi.string().min(5).required(),
        city: Joi.string().min(5).required(),
        postCode: Joi.number().custom((value, helpers) => {
            if (value.toString().length !== 6) {
                console.log("FROM postCode ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
    });
    return schema.validate({
        name: obj.name, email: obj.email, phone: obj.phone, balance: obj.balance,
        street: obj.address?.street, city: obj.address?.city, postCode: obj.address?.postCode
    }, {convert: false});
}

const billingValidate = (obj: BillingInterface) => {
    const schema = Joi.object({
        amount: Joi.number().custom((value, helpers) => {
            if (!(value >= 1000 && value <= 5000)) {
                console.log("FROM BALANCE ", value.toString().length);
                return helpers.error('any.invalid');
            }
            return value;
        }).required(),
        billingType: Joi.string().custom((value, helpers) => {
            if (value === "Account" || value === "Transaction") {
                return value;
            } else {
                return helpers.error('any.invalid');
            }
        }),
        userId: Joi.string(),
    });
    return schema.validate({amount: obj.amount, billingType: obj.billingType, userId: obj.userId}, {convert: false});
}


export const createConnection = async (dbName : string) => {
    let mongodb = new MongoDbHelper();
    let obj : any;
    await mongodb.createConnection(`mongodb://localhost/${dbName}`).then(value => {
        console.log(`Connection to ${dbName} Successfully established..`);
        obj = value;
        //localStorage.setItem("UsersDb",value)
    }).catch((err) => {
       console.log(`Error while connecting to ${dbName}...`,err);
    });
    return obj;
}

export const createUser: RequestHandler = async (req, res,
                                                 next) => {
    const db = await createConnection('Users');
    const User = db.model('User', UserSchema);
    const data = req.body;
    let flag = false;
    let errorMe: object | string = "";
    //console.log(typeof (data.phone));
    let user: IUser = new User({...data});
    if (typeof (data.phone) === "number" && typeof (data.balance) === "number" && typeof (data.address.postCode) === "number") {
        const {error, value} = inputValidate(user);
        if (error) {
            flag = true;
            errorMe = error.message;
        } else {
            await user.save().then((value1: IUser) => {
            }).catch((err) => {
                console.log("ERR during saving user ", err.message);
                flag = true;
                errorMe = err.message;
            });
        }
    } else {
        flag = true;
        errorMe = {
            phone: "May Have Wrong type",
            balance: "May Have Wrong type",
            postalCode: "May Have Wrong type"
        };
    }
    if (flag) {
        res.status(400).json({error: errorMe});
        res.end();
    } else {
        res.status(200).send(user);
    }
}


export const billings: RequestHandler = async (req, res,
                                         next) => {
    const db = await createConnection('Bills');
    const BillingStruct = db.model('Bills', BillingSchema);
    const data = req.body;
    let flag = false;
    let errorMe: object | string = "";
    data['date'] = Date.now();
    let bills: BillingInterface = new BillingStruct({...data});
    if (typeof (data.amount) === "number" && typeof (data.billingType) === "string" && typeof (data.userId) === "string") {
        const {error, value} = billingValidate(bills);
        if(error){
            flag = true;
            errorMe = error.message;
        } else {
            await bills.save().then((value1: BillingInterface) => {

            }).catch((err) => {
                console.log("ERR during saving Bills ", err.message);
                flag = true;
                errorMe = err.message;
            });
        }
    }else {
        flag = true;
        errorMe = {
            amount: "May Have Wrong type",
            userId: "May Have Wrong type",
            billingType: "May Have Wrong type"
        };
    }
    if (flag) {
        res.status(400).json({error: errorMe});
        res.end();
    } else {
        res.status(200).send(bills);
    }

}

export const getBillingDetails : RequestHandler = async (req,res,
                                                   next) => {
    const id = req.params.id;
    console.log(id);
    const db = await createConnection('Bills');
    const BillingStruct = db.model('Bills', BillingSchema);
    let flag = false;
    let arr : BillingInterface[] = [];
    let errorMe: object | string = "";
    let response :string = "";
    await BillingStruct.find({userId : id.toString()}).then((it : BillingInterface[]) => {
        if(it.length < 0) {
            response = "No bills found this User....";
        }else{
            response = `${it.length} records found for this User`;
            arr = it;
        }
    }).catch((err : object) => {
        flag = true;
        errorMe = err;
    });
    if (flag) {
        res.status(400).json({error: errorMe});
        res.end();
    } else {
        res.status(200).send({result : arr,message : response});
    }

}


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
