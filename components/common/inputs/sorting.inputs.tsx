"use client";

import Box from "@mui/material/Box";
import {SelectChangeEvent} from "@mui/material/Select";
import {useState} from "react";
import {FormSelect, SelectModel} from "@/components/common/form/select.form";

interface Props {
    item: {
        id: string;
        name: string;
        options_list: SelectModel[];
    };
}

export default function SortingInput({item}: Props) {
    const [value, setValue] = useState("");
    
    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
    };
    
    return (
        <Box className="min-w-[200px]">
            <FormSelect
                fullWidth
                id={item.id}
                label={item.name}
                placeholder={item.name}
                onChange={handleChange}
                items={item.options_list}
                value={value}/>
        </Box>
    );
}
