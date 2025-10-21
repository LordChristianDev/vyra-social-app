import type { ProfileProp } from "@/features/personalization/types/profile-types";

export type PostProp = {
	id: number;
	author_id: number;
	created_at: string;
	updated_at: string;

	content: string;
	youtube_embed: string | null;
	images: string[] | null;
	tags: TagProp[] | null;
	comments: CommentProp[] | null;

	all_likes: number[];
	all_saved: number[];
	all_shares: number[];

	author: ProfileProp;
};

export type TagProp = {
	id: number;
	category_id: number;
	created_at: string;
	title: string;
	popularity: number;

	category: CategoryProp;
};

export type CommentProp = {
	id: number;
	author_id: number;
	created_at: string;
	content: string;
	all_likes: number[];

	author: ProfileProp;
};

export type CategoryProp = {
	id: number;
	created_at: string;
	title: string;
};