type Result<T, E = Error> = readonly [T, null] | readonly [null, E];

export async function queryDB<T, E = Error>(
	operation: () => Promise<T>
): Promise<Result<T, E>> {
	try {
		const data = await operation();
		return [data, null] as const;
	} catch (error) {
		return [null, error as E] as const;
	}
}