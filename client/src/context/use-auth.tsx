import { createContext, useContext, type ReactNode } from 'react';

import { usePersistedState } from '@/hooks/use-persisted-state';
import { getItem, removeItem } from "@/lib/local-storage";

import type { UserProp } from "@/features/authentication/types/auth-types";

const getLocalUser = (): UserProp | null => {
	const data = getItem('currentUser');
	if (!data) return null;
	return data;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthHook = () => {
	const [currentUser, setCurrentUser] = usePersistedState<UserProp | null>("currentUser", getLocalUser());

	const storeUser = (data: UserProp) => {
		if (!data) {
			throw new Error('Data for user storage is empty');
		}
		setCurrentUser(data);
	}

	const signOut = async (): Promise<boolean> => {
		removeItem('currentUser');
		return true;
	}

	return { currentUser, storeUser, signOut };
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
	currentUser: UserProp | null;
	storeUser: (data: UserProp) => void;
	signOut: () => Promise<boolean>;
};

type AuthProviderProps = {
	children: ReactNode;
};
