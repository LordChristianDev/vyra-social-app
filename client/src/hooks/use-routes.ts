import { useLocation, useNavigate } from 'react-router-dom';

export const useRoutes = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const isActiveRoute = (path: string) => location.pathname === path;

	const move = (path: string) => navigate(path);

	return { navigate, location, isActiveRoute, move };
}