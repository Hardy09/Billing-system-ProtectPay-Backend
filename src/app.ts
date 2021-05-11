// npm i --save-dev @types/node... to install all node types
// then install @types/express also...in order to use specific type sin express, just like we did with lodash.

import express , { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/todo.js'; // we are exporting our default route
import { json } from 'body-parser'; // using body parser as middleware
import MongoDbHelper from './mongoDb/mongoDbHelper.js'

const app = express();

app.use(cors());
app.use(json()); // will parse incoming request.
//app.use('/todos', todoRoutes); // this will send all request to routes that are /todos
app.use('/billingApp',userRoutes);

// Error handling middleware that will run if any other middleware have some error
//  This function is executed every time the app receives a request.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
});


app.listen(3000,() => {
    let mongodb = new MongoDbHelper();
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
