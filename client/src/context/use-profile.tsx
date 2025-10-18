import { createContext, useContext, useState, type ReactNode } from "react";

import type { ProfileProp } from "@/features/personalization/types/profile-types";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileHook = () => {
	const [profile, setProfile] = useState<ProfileProp>({} as ProfileProp);

	const storeProfile = (data: ProfileProp) => {
		if (!data) {
			throw new Error('Data for profile storage is empty');
		}

		setProfile(data);
	};

	const clearProfile = () => setProfile({} as ProfileProp);

	return { profile, storeProfile, clearProfile };
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
	const profileData = useProfileHook();

	return (
		<ProfileContext.Provider value={profileData} >
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = (): ProfileContextType => {
	const context = useContext(ProfileContext);

	if (context === undefined) {
		throw new Error('useProfile must be used within an ProfileProvider');
	}
	return context;
};

type ProfileContextType = {
	profile: ProfileProp;
	storeProfile: (data: ProfileProp) => void;
	clearProfile: () => void;
};

type ProfileProviderProps = {
	children: ReactNode;
};