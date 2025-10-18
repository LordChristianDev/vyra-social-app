import { createContext, useContext, useState, type ReactNode } from 'react';

import { getItem, removeItem, setItem } from "@/lib/local-storage";

import type { UserProp } from "@/features/authentication/types/auth-types";

const getLocalUser = (): UserProp => {
	const data = getItem('user');
	if (!data) return {} as UserProp;
	return data;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthHook = () => {
	const [user, setUser] = useState<UserProp>(getLocalUser());

	const storeUser = (data: UserProp) => {
		if (!data) {
			throw new Error('Data for user storage is empty');
		}
		setItem("user", data);
		setUser(data);
	}

	const signOut = async (): Promise<boolean> => {
		removeItem('user');
		setUser({} as UserProp);
		return true;
	}

	return { user, storeUser, signOut };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const authDdata = useAuthHook();
	return (
		<AuthContext.Provider value={authDdata} >
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};

type AuthContextType = {
	user: UserProp | null;
	storeUser: (data: UserProp) => void;
	signOut: () => Promise<boolean>;
};

type AuthProviderProps = {
	children: ReactNode;
};
