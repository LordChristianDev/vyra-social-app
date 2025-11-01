import { BASE_URL } from "@/main";
import { retryOperation } from "@/lib/utils";
import { tryCatch, type Result } from "@/lib/try-catch";

import type { MediaProp, ProfileProp } from "@/features/personalization/types/profile-types";
import type { UpdateProfileFormProp } from "@/features/personalization/types/settings-types";
import {
	QUERIES as SETTING_QUERIES,
	MUTATIONS as SETTING_MUTATIONS
} from "@/features/personalization/services/settings-services";

/**
 * Controller
 */

export const CONTROLLER = {
	/**
	 * Create new Profile and Settings
	 * @param user_id 
	 * @returns boolean
	 */
	SetNewProfile: async function (user_id: number): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const profile = await retryOperation(
			() => MUTATIONS.createProfile(user_id, "New", "User", null),
			"create profile"
		);
		if (!profile) console.error("Failed to create profile after retries");

		// Create notification settings with retry
		const notifications = await retryOperation(
			() => SETTING_MUTATIONS.createNotificationSettings(user_id),
			"create notification settings"
		);
		if (!notifications) console.error("Failed to create notification settings after retries");

		// Create privacy settings with retry
		const privacy = await retryOperation(
			() => SETTING_MUTATIONS.createPrivacySettings(user_id),
			"create privacy settings"
		);
		if (!privacy) console.error("Failed to create privacy settings after retries");

		return true;
	},
	FetchAllSuggestedProfiles: async function (user_id: number): Promise<ProfileProp[]> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchAllSuggestedProfiles(user_id);

		if (error) throw new Error('Error fetching user:', error);
		if (!data) return [];

		let profiles: ProfileProp[] = [];

		if (data) profiles = data;

		return profiles;
	},
	/**
	 * Fetch Profile with User ID
	 * @param user_id
	 * @returns ProfileProp | null
	 */
	FetchProfileWithUserId: async function (user_id: number): Promise<ProfileProp | null> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchProfileWithUserId(user_id);

		if (error) throw new Error('Error fetching user:', error);
		if (!data) return null;

		let profile: ProfileProp = data;

		if (data) profile = data;

		const [notificationSettings, notificationError] = await SETTING_QUERIES.fetchNotificationSettingsWithUserId(user_id);

		if (notificationError) throw new Error('Error fetching notification settings:', notificationError);

		// Merge notification settings into profile
		if (notificationSettings) profile = { ...profile, notif_settings: notificationSettings };

		const [privacySettings, privacyError] = await SETTING_QUERIES.fetchPrivacySettingsWithUserId(user_id);

		if (privacyError) throw new Error('Error fetching privacy settings:', privacyError);

		// Merge privacy settings into profile
		if (privacySettings) profile = { ...profile, privacy_settings: privacySettings };

		return profile;
	},
	/**
	 * Update Profile with User ID
	 * @param user_id 
	 * @param updates 
	 * @returns boolean
	 */
	UpdateProfileWithUserId: async function (user_id: number, updates: UpdateProfileFormProp): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const cleanUpdates: Object = Object.fromEntries(
			Object.entries(updates).filter(([_, value]) => value !== undefined)
		);

		const [data, error] = await MUTATIONS.updateProfileWithUserId(user_id, cleanUpdates);

		if (error) throw new Error('Error updating user:', error);
		if (!data) return false;

		return true;
	},
	/**
	 * Update Avatar with User ID
	 * @param user_id 
	 * @param avatar 
	 * @returns boolean
	 */
	UpdateAvatarWithUserId: async function (user_id: number, avatar: MediaProp): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const { file } = avatar;

		const ext = file.name.split('.').pop();
		const name = `${user_id}_${Date.now()}.${ext}`;

		const [url, error] = await MUTATIONS.uploadImageToBucket(name, "avatars", avatar);

		if (error) throw new Error('Error updating user:', error);
		if (!url) return false;

		const [result, resultError] = await MUTATIONS.updateProfileAvatarWithUserId(user_id, url);

		if (resultError) throw new Error('Error updating user:', resultError);
		if (!result) return false;

		return true;
	},
	/**
	 * Update Cover with User ID
	 * @param user_id 
	 * @param cover 
	 * @returns boolean
	 */
	UpdateCoverWithUserId: async function (user_id: number, cover: MediaProp): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const { file } = cover;

		const ext = file.name.split('.').pop();
		const name = `${user_id}_${Date.now()}.${ext}`;

		const [url, error] = await MUTATIONS.uploadImageToBucket(name, "covers", cover);

		if (error) throw new Error('Error updating user:', error);
		if (!url) return false;

		const [result, resultError] = await MUTATIONS.updateProfileCoverWithUserId(user_id, url);

		if (resultError) throw new Error('Error updating user:', resultError);
		if (!result) return false;

		return true;
	},
	UploadImageToBucket: async function (user_id: number, cover: MediaProp): Promise<string> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const { file } = cover;

		const ext = file.name.split('.').pop();
		const name = `${user_id}_${Date.now()}.${ext}`;

		const [url, error] = await MUTATIONS.uploadImageToBucket(name, "covers", cover);

		if (error) throw new Error('Error updating user:', error);
		if (!url) return "";

		return url;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllProfiles: async function (): Promise<Result<ProfileProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-all`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profiles: ProfileProp[] = [];

				if (data.status === true && data.data) profiles = data.data;

				return profiles;
			})()
		);
	},
	fetchSomeProfiles: async function (
		page: number,
		pageSize: number,
	): Promise<Result<ProfileProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-some`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page,
						pageSize,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profiles: ProfileProp[] = [];

				if (data.status === true && data.data) profiles = data.data;

				return profiles;
			})()
		);
	},
	fetchProfileWithId: async function (id: number): Promise<Result<ProfileProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-id/${id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profile: ProfileProp | null = null;

				if (data.status === true && data.data) profile = data.data.length > 0 ? data.data[0] : null;

				return profile;
			})()
		);
	},
	fetchProfileWithUserId: async function (user_id: number): Promise<Result<ProfileProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-user-id/${user_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profile: ProfileProp | null = null;

				if (data.status === true && data.data) profile = data.data.length > 0 ? data.data[0] : null;

				return profile;
			})()
		);
	},
	fetchProfileWithUsername: async function (username: string): Promise<Result<ProfileProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-username/${username}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profile: ProfileProp | null = null;

				if (data.status === true && data.data) profile = data.data.length > 0 ? data.data[0] : null;

				return profile;
			})()
		);
	},
	fetchAllSuggestedProfiles: async function (user_id: number): Promise<Result<ProfileProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-all-suggested/${user_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profiles: ProfileProp[] = [];

				if (data.status === true && data.data) profiles = data.data;

				return profiles;
			})()
		);
	},
	fetchSomeSuggestedProfiles: async function (
		user_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<ProfileProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/fetch-some-suggested/${user_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page,
						pageSize,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profiles: ProfileProp[] = [];

				if (data.status === true && data.data) profiles = data.data;

				return profiles;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createProfile: async (
		user_id: number,
		first_name: string,
		last_name: string,
		avatar_url: string | null,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_id,
						first_name,
						last_name,
						avatar_url,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Profile
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updateProfileWithUserId: async (
		user_id: number,
		updates: object,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				console.log(updates)
				const response = await fetch(BASE_URL + `/profile/update-profile-user-id/${user_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						updates,
					}),
				});
				const data = await response.json();
				console.log(data)

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Update Profile
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updateProfileAvatarWithUserId: async (
		user_id: number,
		avatar_url: string,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/update-avatar-user-id/${user_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						avatar_url,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Update Avatar
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updateProfileCoverWithUserId: async (
		user_id: number,
		cover_url: string,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/update-cover-user-id/${user_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						cover_url,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Update Cover
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	uploadImageToBucket: async (
		name: string,
		bucket: string,
		upload: MediaProp
	): Promise<Result<string>> => {
		return tryCatch(
			(async () => {
				if (!upload) throw new Error('Avatar File not found');

				const { file } = upload;

				const authString = btoa(`${import.meta.env.VITE_IMAGE_KIT_PRIVATE_KEY}:`);

				const formData = new FormData();
				formData.append('file', file);
				formData.append('fileName', name);
				formData.append('folder', `/${bucket}`);

				const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
					method: 'POST',
					headers: {
						'Authorization': `Basic ${authString}`
					},
					body: formData
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || 'Upload failed');
				}

				let url: string = "";

				if (data) url = data.url;

				return url;
			})()
		);
	},
	deleteProfileWithUserId: async (user_id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/profile/delete-user-id/${user_id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Profile
				if (data.status === false) return false;

				return true;
			})()
		);
	},
};