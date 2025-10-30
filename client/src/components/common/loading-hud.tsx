import { Loader2 } from "lucide-react";

export const LoadingHud = ({ isOpen, message = "Loading..." }: { isOpen: boolean, message?: string }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
			<div className="rounded-lg p-8 flex flex-col items-center gap-4">
				<Loader2 className="h-12 w-12 animate-spin text-violet-600" />
				<p className="text-gray-700 font-medium text-lg">{message}</p>
			</div>
		</div>
	);
};