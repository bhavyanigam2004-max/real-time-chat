import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://bhavyanigam2004_db_user:A2RE2LhwbNTF64vb@ac-s4muwqp-shard-00-00.rh5kytq.mongodb.net:27017,ac-s4muwqp-shard-00-01.rh5kytq.mongodb.net:27017,ac-s4muwqp-shard-00-02.rh5kytq.mongodb.net:27017/?ssl=true&replicaSet=atlas-ca9fbf-shard-0&authSource=admin&appName=Cluster0", {
            family: 4
        });
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.log("db error", error.message);
    }
}

export default connectDb