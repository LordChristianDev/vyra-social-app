import { createFullName, getInitials } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { CreatePostDialog } from "@/features/dashboard/components/posts/create-post-dialog";

import type { ProfileProp } from "@/features/personalization/types/profile-types";

export const CreatePostCard = ({ profile }: { profile: ProfileProp }) => {
	const { first_name, last_name, avatar_url } = profile;
	const fullName = createFullName(first_name, last_name);

	return (
		<Card className="shadow-soft border-border/50 hover:shadow-medium transition-smooth">
			<CardContent className="px-4">
				<div className="flex gap-3">
					<AvatarIcon
						src={avatar_url ?? ''}
						fallback={getInitials(fullName)}
					/>
					<div className="flex-1">
						<CreatePostDialog profile={profile ?? {} as ProfileProp}>
							<Button
								variant="outline"
								className="justify-start text-muted-foreground cursor-pointer w-full hover:text-foreground transition-smooth"
							>
								What's on your mind?
							</Button>
						</CreatePostDialog>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};