import { toast } from "sonner";

type ToastProps = {
	title: string;
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
	variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const showToast = (props: ToastProps) => {
	const { title, description, duration = 4000, action, className, variant = 'default' } = props;

	const options = {
		description,
		duration,
		action,
		className,
	};

	switch (variant) {
		case 'success':
			return toast.success(title, options);
		case 'error':
			return toast.error(title, options);
		case 'warning':
			return toast.warning(title, options);
		case 'info':
			return toast.info(title, options);
		default:
			return toast(title, options);
	}
}