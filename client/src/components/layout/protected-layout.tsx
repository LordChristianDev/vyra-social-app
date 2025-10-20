import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/context/use-auth";
import { useProfile } from "@/context/use-profile";
import { useRoutes } from "@/hooks/use-routes";
import { getItem } from "@/lib/local-storage";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Appbar } from "@/components/layout/app-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";

// Auth check wrapper component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const isLoggedIn = !!getItem('user');

	if (!isLoggedIn && location.pathname !== '/login') {
		return <Navigate to="/login" state={{ from: location }
		} replace />;
	}

	return children;
};

// Authenticated Layout with AppBar and Sidebar
export const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { move } = useRoutes()
	const { signOut } = useAuth();
	const { clearProfile } = useProfile();

	const isLoggedIn = !!getItem('user');

	useEffect(() => {
		if (!isLoggedIn) {
			signOut();
			clearProfile();
			move('/');
		}
	}, [isLoggedIn]);

	return (
		<SidebarProvider>
			<div className="flex flex-col w-full min-h-screen bg-background">
				<Appbar />
				<div className="flex flex-1">
					<AppSidebar />
					<div className="flex-1 overflow-auto">
						{children}
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
};