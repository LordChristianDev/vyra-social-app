import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type {
	NotificationSettingsProp,
	PrivacySettingsProp
} from "@/features/personalization/types/settings-types";

export const CONTROLLER = {
	UpdateNotificationSettingsWithUserId: async function (
		user_id: number,
		updates: object
	): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const cleanUpdates: Object = Object.fromEntries(
			Object.entries(updates).filter(([_, value]) => value !== undefined)
		);

		const [data, error] = await MUTATIONS.updateNotificationSettingsWithUserId(user_id, cleanUpdates);

		if (error) throw new Error('Error updating user:', error);
		if (!data) return false;

		return true;
	},
	UpdatePrivacySettingsWithUserId: async function (
		user_id: number,
		updates: object
	): Promise<boolean> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const cleanUpdates: Object = Object.fromEntries(
			Object.entries(updates).filter(([_, value]) => value !== undefined)
		);

		const [data, error] = await MUTATIONS.updatePrivacySettingsWithUserId(user_id, cleanUpdates);

		if (error) throw new Error('Error updating user:', error);
		if (!data) return false;

		return true;
	},
};


/**
 * Queries
 */

export const QUERIES = {
	fetchNotificationSettingsWithUserId: async function (user_id: number): Promise<Result<NotificationSettingsProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/setting/fetch-notification-settings/${user_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Notification Settings
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let settings: NotificationSettingsProp | null = null;

				if (data.status === true && data.data) settings = data.data.length > 0 ? data.data[0] : null;

				return settings;
			})()
		);
	},
	fetchPrivacySettingsWithUserId: async function (user_id: number): Promise<Result<PrivacySettingsProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/setting/fetch-privacy-settings/${user_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Notification Settings
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let settings: PrivacySettingsProp | null = null;

				if (data.status === true && data.data) settings = data.data.length > 0 ? data.data[0] : null;

				return settings;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createNotificationSettings: async (user_id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/create-notification-settings/${user_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	createPrivacySettings: async (user_id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/create-privacy-settings/${user_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Privacy Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updateNotificationSettingsWithUserId: async (
		user_id: number,
		updates: object,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/update-notifications-settings/${user_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						updates
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updatePrivacySettingsWithUserId: async (
		user_id: number,
		updates: object,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/update-privacy-settings/${user_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						updates
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deleteNotificationSettingsWithUserId: async (user_id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/delete-notification-settings/${user_id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deletePrivacySettingsWithUserId: async (user_id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(
					BASE_URL + `/setting/delete-privacy-settings/${user_id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification Settings
				if (data.status === false) return false;

				return true;
			})()
		);
	},
};
