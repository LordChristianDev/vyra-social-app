import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getTheme = (): boolean => {
	if (typeof window === "undefined") return false;
	const localTheme = localStorage.getItem("theme");
	if (localTheme == null) return false;
	return localTheme === "dark";
};

const useThemeHook = (): ThemeContextType => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(getTheme);

	const toggleTheme = useCallback(() => {
		setIsDarkMode((prev) => !prev);
	}, []);

	const setCurrentTheme = useCallback((theme: boolean) => {
		setIsDarkMode(theme);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (isDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDarkMode]);

	return { isDarkMode, toggleTheme, setCurrentTheme };
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const themeData = useThemeHook();
	return (
		<ThemeContext.Provider value={themeData}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

type ThemeContextType = {
	isDarkMode: boolean;
	toggleTheme: () => void;
	setCurrentTheme: (theme: boolean) => void;
};

type ThemeProviderProps = {
	children: ReactNode;
};
