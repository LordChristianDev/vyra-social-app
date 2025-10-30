import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";

import { useAuth } from "@/context/use-auth";
import { showToast } from "@/lib/show-toast";
import { formatTimestamp } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

import {
	UpdateProfileFormSchema, type UpdateProfileFormProp
} from "@/features/personalization/types/settings-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { CONTROLLER } from "@/features/personalization/services/profile-services";

export const SettingsProfile = ({ profile }: { profile: ProfileProp }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { currentUser } = useAuth();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<UpdateProfileFormProp>({
		defaultValues: {
			first_name: profile.first_name || "",
			last_name: profile.last_name || "",
			birth_date: profile.birth_date ? formatTimestamp(profile.birth_date) : "",
			username: profile.username || "",
			bio: profile.bio || "",
			location: profile.location || "",
			description: profile.description || "",
			middle_name: profile.middle_name || "",
			suffix: profile.suffix || "",
			website_url: profile.website_url || "",
		},
		resolver: zodResolver(UpdateProfileFormSchema),
		mode: 'onChange',
	});

	const onSubmit: SubmitHandler<UpdateProfileFormProp> = async (data) => {
		if (!data) {
			showToast({
				title: "Form Empty!",
				description: "Please populate the profile form.",
				variant: "warning"
			});
			return;
		}

		if (!currentUser?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this update.",
				variant: "error"
			});
			return;
		}

		setIsLoading(true);

		const response = await CONTROLLER
			.UpdateProfileWithUserId(
				currentUser.id,
				data,
			);

		if (!response) {
			showToast({
				title: "Update Failed!",
				description: "Failed to update account information.",
				variant: "error"
			});
			setIsLoading(false);
			return;
		}

		showToast({
			title: "Updated Profile Successfully!",
			description: "Profile information has been updated.",
			variant: "success"
		});
		setIsLoading(false);
		queryClient.invalidateQueries({ queryKey: ["settings-profile"] });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" >
			<Card className="shadow-soft">
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Profile Name */}
					<div className="grid grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="first_name">First Name</Label>
							<Input
								{...register("first_name")}
								type="text"
								placeholder="Enter your first name..."
							/>
							{errors.first_name && (
								<p className="text-sm text-red-600 mt-1">
									{errors.first_name.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="middle_name">Middle Name</Label>
							<Input
								{...register("middle_name")}
								type="text"
								placeholder="Enter your middle name..."
							/>
							{errors.middle_name && (
								<p className="text-sm text-red-600 mt-1">
									{errors.middle_name.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="last_name">Last Name</Label>
							<Input
								{...register("last_name")}
								type="text"
								placeholder="Enter your last name..."
							/>
							{errors.last_name && (
								<p className="text-sm text-red-600 mt-1">
									{errors.last_name.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="suffix">Suffix</Label>
							<Input
								{...register("suffix")}
								type="text"
								placeholder="Enter your suffix (e.g.: Jr., Sr., etc.)..."
							/>
							{errors.suffix && (
								<p className="text-sm text-red-600 mt-1">
									{errors.suffix.message}
								</p>
							)}
						</div>
					</div>

					{/* Username & Birth Date */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								{...register("username")}
								type="text"
								placeholder="Enter your username..."
							/>

							{errors.username && (
								<p className="text-sm text-red-600 mt-1">
									{errors.username.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="birth_date">Birth date</Label>
							<Controller
								name="birth_date"
								control={control}
								render={({ field }) => (
									<DatePicker
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										onBlur={field.onBlur}
										name={field.name}
									/>
								)}
							/>
							{errors.birth_date && (
								<p className="text-sm text-red-600 mt-1">
									{errors.birth_date.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								{...register("location")}
								type="text"
								placeholder="Enter your location..."
							/>
							{errors.location && (
								<p className="text-sm text-red-600 mt-1">
									{errors.location.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="website_url">Website</Label>
							<Input
								{...register("website_url")}
								type="text"
								placeholder="Enter your website url..."
							/>
							{errors.website_url && (
								<p className="text-sm text-red-600 mt-1">
									{errors.website_url.message}
								</p>
							)}
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							{...register("bio")}
							placeholder="Enter your bio..."
							className="min-h-[60px]"
						/>
						{errors.bio && (
							<p className="text-sm text-red-600 mt-1">
								{errors.bio.message}
							</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							{...register("description")}
							placeholder="Enter your description..."
							className="min-h-[120px]"
						/>
						{errors.description && (
							<p className="text-sm text-red-600 mt-1">
								{errors.description.message}
							</p>
						)}
					</div>

					{/*Submit Button  */}
					<Button
						type="submit"
						disabled={isLoading}
						className="flex bg-violet-600 hover:bg-violet-400 cursor-pointer">
						{isLoading
							? <span className="flex items-center">
								<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span className="p-18-semibold text-white">Saving...</span>
							</span>
							: <span className="p-18-semibold text-white">Save Changes</span>}
					</Button>
				</CardContent>
			</Card>
		</form>
	);
};