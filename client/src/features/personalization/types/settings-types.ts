import z from "zod";

export const UpdateProfileFormSchema = z.object({
	// Required Fields
	first_name: z.string().min(1, "First Name is Required"),
	last_name: z.string().min(1, "Last Name is Required"),
	birth_date: z.string().min(1, "Birth Date is Required"),

	username: z.string().min(1, "Username is Required"),
	bio: z.string().min(1, "Bio is Required"),
	location: z.string().min(1, "Location is Required"),
	description: z.string().min(1, "Description is Required"),

	// Optional Fields
	middle_name: z.string().optional(),
	suffix: z.string().optional(),
	website_url: z.string().optional(),
});

export type UpdateProfileFormProp = z.infer<typeof UpdateProfileFormSchema>;

export type NotificationSettingsProp = {
	id: number;
	user_id: number;

	notify_likes: boolean;
	notify_comments: boolean;
	notify_follows: boolean;
	notify_messages: boolean;
};

export type PrivacySettingsProp = {
	id: number;
	user_id: number;

	is_verified: boolean;
	is_public: boolean;
	show_active: boolean;
};