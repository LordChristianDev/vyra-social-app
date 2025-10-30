import { format } from "date-fns";

export const createFullName = (
	firstName: string,
	lastName: string,
	middleName?: string,
	suffix?: string,
) => {
	return [firstName, middleName, lastName, suffix].filter(Boolean).join(" ");
};

export const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export function capitalizeFirstLetter(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatIsoString = (isoString: string) => {
	if (!isoString) return "";
	return format(new Date(isoString), "MMMM dd, yyyy");
};

export const cleanUrl = (url: string) => {
	return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

export const timeAgo = (isoString: string) => {
	const timestamp = new Date(isoString);
	const now = new Date();
	const diffMs = now.getTime() - timestamp.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHr = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHr / 24);
	const diffMonth = Math.floor(diffDay / 30);
	const diffYear = Math.floor(diffDay / 365);

	if (diffSec < 60) {
		return "just now";
	} else if (diffMin < 60) {
		return `${diffMin}m ago`;
	} else if (diffHr < 24) {
		return `${diffHr}h ago`;
	} else if (diffDay < 30) {
		return `${diffDay}d ago`;
	} else if (diffYear < 1) {
		const months = diffMonth;
		const days = diffDay % 30;
		return days > 0 ? `${months} month${months > 1 ? "s" : ""} and ${days}d ago`
			: `${months} month${months > 1 ? "s" : ""} ago`;
	} else {
		const years = diffYear;
		const months = Math.floor((diffDay % 365) / 30);
		return months > 0 ? `${years} year${years > 1 ? "s" : ""} and ${months} month${months > 1 ? "s" : ""} ago`
			: `${years} year${years > 1 ? "s" : ""} ago`;
	}
};

export function formatTimestamp(timestamp: string | Date): string {
	const date = new Date(timestamp);
	return date.toISOString().split('T')[0];
}
