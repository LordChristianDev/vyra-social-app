import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_CONNECTION;

export const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});
