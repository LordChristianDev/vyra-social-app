import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { useRoutes } from "@/hooks/use-routes";
import { CONTROLLER } from "@/features/authentication/services/auth-services";

export default function LoginPage() {
	return <LoginContent />;
}

const LoginContent = () => {
	const { move } = useRoutes();
	const { isSignedIn, isLoaded, user } = useUser();
	const { currentUser, storeUser, signOut } = useAuth();

	const { data, isFetching, isError } = useQuery({
		queryKey: ["login-user", user?.id],
		queryFn: async () => CONTROLLER.FetchUserWithUid(user?.id ?? ""),
		enabled: isLoaded && isSignedIn && !!user?.id,
		staleTime: 0,
		retry: 1,
	});

	useEffect(() => {
		if (!isLoaded) {
			console.log("Clerk is loading...");
			return;
		}

		// If Clerk has finished loading and the user is NOT signed in, then sign out + go home
		if (!isSignedIn) {
			console.log("Not signed in, redirecting to home");
			signOut();
			move("/");
		}
	}, [isLoaded, isSignedIn]);

	useEffect(() => {
		if (currentUser?.id && user?.id) {
			console.log("User data loaded, navigating to home");
			move("/home");
		}
	}, [currentUser, user]);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user?.id) {
			return;
		}

		// Still fetching
		if (isFetching) {
			console.log("Fetching user data...");
			return;
		}

		// User exists in database
		if (data) {
			storeUser(data);
			return;
		}

		// User doesn't exist - create new user
		if (data === null) {
			console.log("User not found, creating new user");
			handleCreateUser();
		}
	}, [isLoaded, isSignedIn, user, data, isFetching, isError]);

	const handleCreateUser = async () => {
		try {
			const newUser = await CONTROLLER.SetupNewUser(user?.id ?? "");
			if (newUser) {
				console.log("New user created successfully");
				storeUser(newUser);
			} else {
				throw new Error("Failed to create user");
			}
		} catch (error) {
			console.error("Error creating user:", error);
			signOut();
			move("/");
		}
	};

	return (
		<main className="flex items-center justify-center bg-background w-full min-h-screen">
			<div className="flex items-center">
				<svg className="animate-spin h-8 w-8 text-muted-foreground mr-4" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
				<span className="text-2xl text-muted-foreground">Logging in...</span>
			</div>
		</main>
	);
};