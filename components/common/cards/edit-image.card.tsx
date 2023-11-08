// noinspection TypeScriptValidateTypes

import Image, {StaticImageData} from "next/image";
import {Box, Divider, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {ChangeEvent} from "react";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
    id: string;
    preview: string;
    alt: string;
    base: StaticImageData;
    onEdit: (file: File) => any,
    onDelete: Function,
    disabled: boolean;
};

export default function EditImageCard({preview, base, id, alt, disabled, onEdit, onDelete}: Props) {

    const on_image_selected = (e: ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        onEdit(e.target.files[0]);
    };

    return (
            <Box className="relative space-y-2">

                <input
                        accept="image/*"
                        id={`photo-${id}`}
                        onChange={on_image_selected}
                        type="file"
                        name="photo"
                        hidden
                />

                <Box className="flex justify-evenly items-center gap-2 z-50 border-2 border-primary rounded-full">


                    <label htmlFor={`photo-${id}`}>
                        <IconButton disabled={disabled} color="primary" component="div">
                            <EditIcon fontSize="small"/>
                        </IconButton>
                    </label>

                    <Divider orientation="vertical" flexItem/>

                    <IconButton
                            onClick={() => onDelete()}
                            disabled={disabled}
                            color="error"
                            component="div">
                        <CloseIcon fontSize="small"/>
                    </IconButton>

                </Box>

                <Image
                        src={preview ? preview : base}
                        alt={alt}
                        width="100"
                        height="50"
                        className="border-2 border-primary"
                        style={{width: "150px", height: "150px"}}
                />
            </Box>
    );
}
