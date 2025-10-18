import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { useRoutes } from "@/hooks/use-routes";

import { QUERIES } from "@/features/authentication/services/auth-services";

const LoginPage = () => {
	const { move } = useRoutes();
	const { user, storeUser } = useAuth();

	const { data, isFetching } = useQuery({
		queryKey: ["login-user"],
		queryFn: async () => QUERIES.fetchProfileWithUid(),
		enabled: true,
		staleTime: 0
	});

	useEffect(() => {
		if (user?.id) {
			move("/home");
		}
	}, [user]);

	useEffect(() => {
		if (data && !isFetching) {
			storeUser(data);
		}
	}, [data, isFetching]);

	return (
		<main className="flex items-center justify-center bg-background w-full min-h-screen">
			<div className="flex items-center">
				<svg className="animate-spin h-8 w-8 text-white mr-4" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
				<span className="text-2xl text-white">Logging in...</span>
			</div>
		</main>
	);
}

export default LoginPage;