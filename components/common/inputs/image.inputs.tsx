import {Box, IconButton, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import ImageIcon from "@mui/icons-material/Image";
import DefaultAvatar from "@/public/seller/default_avatar.webp";
import ImageCard from "./../cards/image.card";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {
    id: string;
    init: string;
    disabled: boolean;
    hasError: boolean;
    error: string;
    onImageSubmit: (file: File) => void;
}

export default function InputImage({ id, init, disabled, hasError, error, onImageSubmit, t }: Props) {
    const [preview, setPreview] = useState<string>(init ?? "");

    const onImageSelected = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();

        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        const imageFile = e.target.files[0];

        reader.readAsDataURL(imageFile);

        reader.onload = () => {
            if (reader.readyState !== 2) {
                return;
            }
            setPreview(reader.result as string);
            onImageSubmit(imageFile);
        };
    };

    return (
        <Box
            id={id}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            <ImageCard preview={preview} alt={id} base={DefaultAvatar} />

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                    accept="image/*"
                    id="icon-button-photo"
                    onChange={onImageSelected}
                    type="file"
                    name="photo"
                    hidden
                />

                <label htmlFor="icon-button-photo">
                    <IconButton disabled={disabled} color="primary" component="div">
                        <ImageIcon width={15} height={15} />
                        <Typography variant="body1" sx={{ mx: "4px" }}>
                            {t!("placeholders.select_photo")}
                        </Typography>
                    </IconButton>
                </label>

            </Box>

            {hasError && (
                <Typography variant="caption" sx={{ color: "red" }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
