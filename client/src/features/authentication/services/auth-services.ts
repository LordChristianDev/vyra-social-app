import type { UserProp } from "@/features/authentication/types/auth-types";

export const QUERIES = {
	fetchProfileWithUid: async function (): Promise<UserProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 2000))

		let profile: UserProp = mockUser;
		return profile;
	},
};

export const MUTATIONS = {};

const mockUser: UserProp = {
	id: 1,
	created_at: "2025-09-20 16:48:11.644153+00",
	google_uid: "08234n234123nmn2l32432v4",
	type: "regular",
	last_login: "2025-09-20 16:48:11.644153+00",
}