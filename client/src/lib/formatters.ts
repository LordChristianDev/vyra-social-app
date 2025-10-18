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
}
