"use client";

import Box from "@mui/material/Box";
import {SelectChangeEvent} from "@mui/material/Select";
import {useState} from "react";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {
    item: {
        id: string;
        name: string;
        options_list: SelectModel[];
    };
    onChange?: (string) => any;
}

export default function FilterInput({item, locale, onChange}: Props) {

    const [value, setValue] = useState<string>("");

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);

        if (onChange) {
            onChange(event.target.value as string);
        }
    };

    return (
            <Box className="!col-span-1">
                <FormSelect
                        id={item.id}
                        fullWidth
                        value={value}
                        label={item.name}
                        placeholder={item.name}
                        onChange={handleChange}
                        items={item.options_list}
                        variant="outlined"
                        locale={locale}
                />
            </Box>
    );
}
