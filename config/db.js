const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
/*Cadena para cluster en la web
//"mongodb+srv://house117:123@socialnetwork-fm5lk.mongodb.net/test?retryWrites=true",
Cadena para db local:
"mongoURI": "mongo.exe mongodb://localhost:27017/socialnetwork?authSource=admin --username house",
*/
const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});

		console.log("MongoDB connected");
	} catch (err) {
		console.error(err.message);
		//Sale del proceso con error
		process.exit(1);
	}
};

module.exports = connectDB;
