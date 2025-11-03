import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type { UserProp } from "@/features/authentication/types/auth-types";
import { CONTROLLER as PROFILE_CONTROLLER } from "@/features/personalization/services/profile-services";

/**
 * Controller
 */

export const CONTROLLER = {
	SetupNewUser: async function (uid: string): Promise<UserProp> {
		if (!uid) throw new Error("No Unique Identifier");

		const [user, userError] = await QUERIES.fetchUserWithUid(uid);

		if (userError) throw new Error('Error checking existing user:', userError);

		// User Already Exits
		if (user) return user;

		// Create New User
		const [create, createError] = await MUTATIONS.createUserWithUid(uid);

		// Check if There is Error when creating new user
		if (!create || createError) throw new Error("Failed to create user");

		const [newUser, newError] = await QUERIES.fetchUserWithUid(uid);

		// Check if There is Error when fetching new user
		if (!newUser || newError) throw new Error("Failed to fetch user");

		await PROFILE_CONTROLLER.SetNewProfile(newUser.id);

		return newUser;
	},
	FetchUserWithUid: async function (uid: string): Promise<UserProp | null> {
		if (!uid) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchUserWithUid(uid);

		if (error) throw new Error('Error fetching user:', error);

		return data;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllUsers: async function (): Promise<Result<UserProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/auth/fetch-all`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Users
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let users: UserProp[] = [];

				if (data.status === true && data.data) users = data.data;

				return users;
			})()
		);
	},
	fetchUserWithId: async function (id: number): Promise<Result<UserProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/auth/fetch-ud/${id}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch User
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let user: UserProp | null = null;

				if (data.status === true && data.data) user = data.data.length > 0 ? data.data[0] : null;

				return user;
			})()
		);
	},
	fetchUserWithUid: async function (uid: string): Promise<Result<UserProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/auth/fetch-uid/${uid}`, {
					method: "GET"
				});
				const data = await response.json();

				// Check if response is ok
				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch User
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let user: UserProp | null = null;

				if (data.status === true && data.data) user = data.data.length > 0 ? data.data[0] : null;

				return user;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createUserWithUid: async function (uid: string): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/auth/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						uid
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create User
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deleteUserWithId: async function (id: number): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/auth/delete-id/${id}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete User
				if (data.status === false) return false;

				return true;
			})()
		);
	},
};