import mongoose from 'mongoose';

export default class MongoDbHelper {

    name: string;

    constructor() {
        this.name = "mongodb://localhost/mongotube";
    }

    // handling multiple connection....
    public async createConnection(url: string) {
        const db = await mongoose.createConnection(url, {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true});
        mongoose.connection
            .once("open", () => console.log("Connected"))
            .on("error", (error) => {
                console.log("Error While Connecting ", error);
            });
        return db;
    }


    public async createSingleConnection(url: string) {
        await mongoose.connect(url, {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true});
        mongoose.connection
            .once("open", () => console.log("Connected"))
            .on("error", (error) => {
                console.log("Error While Connecting ", error);
            });
    }

}
