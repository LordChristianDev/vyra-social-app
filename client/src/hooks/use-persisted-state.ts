import { useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/local-storage";

export function usePersistedState<T>(key: string, initialValue: T) {
	const [value, setValue] = useState(() => {
		const item = getItem(key);
		return (item as T) || initialValue;
	});

	useEffect(() => {
		setItem(key, value);
	}, [value]);

	return [value, setValue] as const;
}