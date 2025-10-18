export type UserProp = {
	id: number;
	created_at: string;
	google_uid: string;
	type: "regular" | "employer";
	last_login: string;
};