import { MongoClient, ServerApiVersion } from "mongodb";

import { getEnvVar } from "@/utils/utils";

const uri = getEnvVar("MONGO_CONNECTION");

export const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

export const db = client.db("vyra");
