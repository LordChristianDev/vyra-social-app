import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";
import type { NotificationSettingsProp, PrivacySettingsProp } from "@/features/personalization/types/settings-types";

export const QUERIES = {};

export const MUTATIONS = {
	createNotificationSettings: async (
		user_id: number,
	): Promise<Result<NotificationSettingsProp | null>> => {
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

				return data as NotificationSettingsProp;
			})()
		);
	},
	createPrivacySettings: async (
		user_id: number,
	): Promise<Result<PrivacySettingsProp | null>> => {
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

				return data as PrivacySettingsProp;
			})()
		);
	},
};
