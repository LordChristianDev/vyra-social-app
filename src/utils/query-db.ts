import { Db } from "mongodb";
import { client, db } from "@config/db";

type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function queryDB<T, E = Error>(
	operation: (db: Db) => Promise<T>
): Promise<Result<T, E>> {
	return client
		.connect()
		.then(async () => {
			const data = await operation(db);
			return [data, null] as const;
		})
		.catch((error) => {
			return [null, error as E] as const;
		})
		.finally(() => client.close());
};
