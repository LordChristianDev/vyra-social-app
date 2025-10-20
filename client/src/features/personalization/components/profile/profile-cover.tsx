import { useState } from "react";
import { Camera, Image } from "lucide-react";

import { createFullName, getInitials } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { UploadCoverDialog } from "@/features/personalization/components/profile/upload-cover-dialog";
import { UploadAvatarDialog } from "@/features/personalization/components/profile/upload-avatar-dialog";

import type { ProfileProp } from "@/features/personalization/types/profile-types";

export const ProfileCover = ({ profile }: { profile: ProfileProp }) => {
	const [isAvatarHovered, setIsAvatarHovered] = useState<boolean>(false);
	const [isCoverHovered, setIsCoverHovered] = useState<boolean>(false);

	const { first_name, last_name, avatar_url, cover_url } = profile ?? {} as ProfileProp;

	const fullName = createFullName(first_name, last_name);
	const initials = getInitials(fullName);

	return (
		<div className="mb-6 relative rounded-xl overflow-hidden h-48 md:h-64"
			onMouseEnter={() => setIsCoverHovered(true)}
			onMouseLeave={() => setIsCoverHovered(false)}
		>
			<img
				src={cover_url ?? '/background/valley.webp'}
				alt="Cover"
				className="object-cover w-full h-full"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
			{isCoverHovered && (
				<UploadCoverDialog cover_url={cover_url ?? '/background/valley.webp'} >
					<Button variant="check" className="absolute -bottom-1 -right-1 gap-2 cursor-pointer">
						<Image className="h-4 w-4" />
						Upload Cover Photo
					</Button>
				</UploadCoverDialog>

			)}

			{/* Profile Avatar */}
			<div className="absolute bottom-[1rem] left-[2rem]"
				onMouseEnter={() => setIsAvatarHovered(true)}
				onMouseLeave={() => setIsAvatarHovered(false)}
			>
				<div className="relative">
					<AvatarIcon
						src={avatar_url ?? ""}
						fallback={initials}
						size="3xl"
						className="border-4 border-background shadow-strong"
					/>
					{isAvatarHovered && (
						<UploadAvatarDialog avatar_url={avatar_url ?? ""}>
							<Button
								size="icon"
								className="absolute -bottom-1 -right-1 rounded-full bg-gradient-primary text-primary-foreground w-8 h-8 shadow-medium hover:scale-105 transition-smooth cursor-pointer"
							>
								<Camera className="h-4 w-4" />
							</Button>
						</UploadAvatarDialog>
					)}
				</div>
			</div>
		</div>

	);
} 