"use client";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import { GlobalInterface } from "@/interfaces/global.interface";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";

export interface SelectModel {
    id?: string;
    name: string;
    value: string;
}

interface MainInterface extends GlobalInterface {
    id: string;
    required?: boolean;
    fullWidth?: boolean;
    label: string;
    placeholder: string;
    variant?: "standard" | "outlined" | "filled";
    items: {
        id?: string;
        name: string;
        value: string;
    }[];
    error?: boolean;
    disabled?: boolean;
}

type PropsWithController<T> = MainInterface & { field: ControllerRenderProps };
type PropsWithoutController<T> = MainInterface & {
    value: any;
    onChange: (event: SelectChangeEvent<T>, child: React.ReactNode) => void;
};

type Props<T> = PropsWithController<T> | PropsWithoutController<T>;

export function FormSelect<T>({
    id,
    value = "",
    onChange = null,
    required = false,
    fullWidth = false,
    variant = "standard",
    label,
    placeholder,
    items,
    field = null,
    error = false,
    disabled = false,
}: Props<T>) {
    const content_placeholder = (
        <MenuItem value={value} disabled>
            {placeholder}
        </MenuItem>
    );

    const content_list = items.map((e, i) => (
        <MenuItem key={i} value={e.value}>
            {e.name}
        </MenuItem>
    ));

    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel id={`label_${id}`}>{label}</InputLabel>
            {field && (
                <Select
                    id={id}
                    labelId={`label_${id}`}
                    label={label}
                    {...field}
                    placeholder={placeholder}
                    required={required}
                    variant={variant}
                    disabled={disabled}
                    error={error}
                >
                    {content_placeholder}
                    {content_list}
                </Select>
            )}

            {onChange && (
                <Select
                    id={id}
                    labelId={`label_${id}`}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    variant={variant}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    error={error}
                >
                    {content_placeholder}
                    {content_list}
                </Select>
            )}
        </FormControl>
    );
}
