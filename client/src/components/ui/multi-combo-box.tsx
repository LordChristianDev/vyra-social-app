import { ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { type UseFormRegisterReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

type MultiSelectComboBoxProps = {
	dataSource: {
		name: string;
		label: string
	}[];
	title?: string;
	defaultValue?: string[];
	register?: UseFormRegisterReturn;
	onChange?: (value: string[]) => void;
	value?: string[];
	maxDisplay?: number;
}

export function MultiSelectComboBox({
	dataSource,
	title,
	defaultValue = [],
	register,
	onChange: externalOnChange,
	value: externalValue,
	maxDisplay = 2
}: MultiSelectComboBoxProps) {
	const [open, setOpen] = useState(false)
	const [internalValue, setInternalValue] = useState<string[]>(defaultValue)

	// Use external value if provided (controlled), otherwise use internal state
	const value = externalValue !== undefined ? externalValue : internalValue;

	const handleOnSelect = (selectedValue: string) => {
		const newValue = value.includes(selectedValue)
			? value.filter((v) => v !== selectedValue)
			: [...value, selectedValue];

		// Update internal state if not controlled
		if (externalValue === undefined) {
			setInternalValue(newValue);
		}

		// Call external onChange if provided
		if (externalOnChange) {
			externalOnChange(newValue);
		}

		// Call register's onChange if provided
		if (register?.onChange) {
			register.onChange({
				target: { name: register.name, value: newValue }
			});
		}
	}

	const getDisplayText = () => {
		if (value.length === 0) {
			return `Select ${title ?? 'items'}...`;
		}

		if (value.length <= maxDisplay) {
			return value
				.map(v => dataSource.find(d => d.name === v)?.label)
				.filter(Boolean)
				.join(", ");
		}

		return `${value.length} ${title ?? 'items'} selected`;
	}

	const renderDataSource = dataSource.map((data) => {
		const { name, label } = data;
		const isSelected = value.includes(name);

		return (
			<CommandItem
				key={name}
				value={name}
				onSelect={() => handleOnSelect(name)}
			>
				<Check
					className={cn(
						"mr-2 h-4 w-4",
						isSelected ? "opacity-100" : "opacity-0"
					)}
				/>
				{label}
			</CommandItem>
		);
	})

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
					type="button"
				>
					<span className="truncate">{getDisplayText()}</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder={`Search ${title ?? 'items'}...`} className="h-9" />
					<CommandList>
						<CommandEmpty>No {title ?? 'items'} found.</CommandEmpty>
						<CommandGroup>
							{renderDataSource}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
			{/* Hidden input for form integration */}
			{register && (
				<input
					type="hidden"
					{...register}
					value={JSON.stringify(value)}
				/>
			)}
		</Popover>
	)
}