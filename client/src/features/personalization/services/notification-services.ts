import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type { NotificationProp } from "@/features/personalization/types/notification-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

/**
 * Controller
 */

export const CONTROLLER = {
	/**
	 * Creates a new notification
	 * @param author_id 
	 * @param recipient_id 
	 * @param content 
	 * @param type 
	 * @returns boolean
	 */
	CreateNewNotification: async function (
		author_id: number,
		recipient_id: number,
		content: string,
		type: string,
	): Promise<boolean> {
		if (!author_id) throw new Error("No Unique Identifier Found");
		if (!recipient_id) throw new Error("No Unique Identifier Found");
		if (!content) throw new Error("Content is Needed");
		if (!type) throw new Error("Type is Needed");

		const [status, error] = await MUTATIONS.createNotification(author_id, recipient_id, content, type);

		if (error) throw new Error('Error creating notification:', error);
		if (!status) return false;

		return true;
	},
	/**
	 * Fetches all notifications
	 * @returns NotificationProp[]
	 */
	FetchAllNotifications: async function (): Promise<NotificationProp[]> {
		const [data, error] = await QUERIES.fetchAllNotifications();

		if (error) throw new Error("Error fetching notifications", error);
		if (!data) return [];

		const result = await Promise.all(
			data.map(async (notification) => {
				let setNotification: NotificationProp = notification;

				const author = await PROFILE_CONTROLLER.FetchProfileWithUserId(notification.author_id);
				if (author) setNotification = { ...setNotification, author };

				return setNotification;
			})
		);

		return result;
	},
	/**
	 * Fetches some notifications
	 * @param page 
	 * @param pageSize 
	 * @returns NotificationProp[]
	 */
	FetchSomeNotifications: async function (
		page: number,
		pageSize: number,
	): Promise<NotificationProp[]> {
		const [data, error] = await QUERIES.fetchSomeNotifications(page, pageSize);

		if (error) throw new Error("Error fetching notifications", error);
		if (!data) return [];

		const result = await Promise.all(
			data.map(async (notification) => {
				let setNotification: NotificationProp = notification;

				const author = await PROFILE_CONTROLLER.FetchProfileWithUserId(notification.author_id);
				if (author) setNotification = { ...setNotification, author };

				return setNotification;
			})
		);

		return result;
	},
	/**
	 * Fetches all notifications with user id
	 * @param user_id 
	 * @returns NotificationProp[]
	 */
	FetchAllNotificationsWithUserId: async function (user_id: number): Promise<NotificationProp[]> {
		const [data, error] = await QUERIES.fetchAllNotificationsWithUserId(user_id);

		if (error) throw new Error("Error fetching notifications", error);
		if (!data) return [];

		const result = await Promise.all(
			data.map(async (notification) => {
				let setNotification: NotificationProp = notification;

				const author = await PROFILE_CONTROLLER.FetchProfileWithUserId(notification.author_id);
				if (author) setNotification = { ...setNotification, author };

				return setNotification;
			})
		);

		return result;
	},
	/**
	 * Fetches some notifications with user id
	 * @param user_id 
	 * @param page 
	 * @param pageSize 
	 * @returns NotificationProp[]
	 */
	FetchSomeNotificationsWithUserId: async function (
		user_id: number,
		page: number,
		pageSize: number,
	): Promise<NotificationProp[]> {
		const [data, error] = await QUERIES.fetchSomeNotificationsWithUserId(user_id, page, pageSize);

		if (error) throw new Error("Error fetching notifications", error);
		if (!data) return [];

		const result = await Promise.all(
			data.map(async (notification) => {
				let setNotification: NotificationProp = notification;

				const author = await PROFILE_CONTROLLER.FetchProfileWithUserId(notification.author_id);
				if (author) setNotification = { ...setNotification, author };

				return setNotification;
			})
		);

		return result;
	},
	/**
	 * Updates a notification
	 * @param id 
	 * @returns boolean
	 */
	UpdateNotification: async function (id: number): Promise<boolean> {
		const [status, error] = await MUTATIONS.updateNotification(id);

		if (error) throw new Error("Error updating notification", error);
		if (!status) return false;

		return true;
	},
	/**
	 * Deletes a notification
	 * @param id 
	 * @returns boolean
	 */
	DeleteNotification: async function (id: number): Promise<boolean> {
		const [status, error] = await MUTATIONS.deleteNotification(id);

		if (error) throw new Error("Error deleting notification", error);
		if (!status) return false;

		return true;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllNotifications: async function (): Promise<Result<NotificationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/fetch-all`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Notifications
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: NotificationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeNotifications: async function (
		page: number,
		pageSize: number,
	): Promise<Result<NotificationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/fetch-all`, {
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

				// Failed to Fetch Notifications
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: NotificationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchAllNotificationsWithUserId: async function (user_id: number): Promise<Result<NotificationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/fetch-all-with-user-id/${user_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Notifications
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: NotificationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeNotificationsWithUserId: async function (
		user_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<NotificationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/fetch-some-with-user-id/${user_id}`, {
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

				// Failed to Fetch Notifications
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: NotificationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createNotification: async function (
		author_id: number,
		recipient_id: number,
		content: string,
		type: string,
	): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						author_id,
						recipient_id,
						content,
						type,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Notification
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return data.status;
			})()
		);
	},
	updateNotification: async function (id: number): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/update/${id}`, {
					method: "PUT",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Update Notification
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return data.status;
			})()
		);
	},
	deleteNotification: async function (id: number): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/notification/delete/${id}`, {
					method: "DELETE",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Notification
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return data.status;
			})()
		);
	},
};