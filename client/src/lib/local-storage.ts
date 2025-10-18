function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function setItem(key: string, value: unknown) {
	if (!isBrowser()) return;

	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(error);
	}
}

export function getItem(key: string) {
	if (!isBrowser()) return undefined;

	try {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : undefined;
	} catch (error) {
		console.error(error);
	}
}

export function removeItem(key: string) {
	if (!isBrowser()) return;
	window.localStorage.removeItem(key);
}