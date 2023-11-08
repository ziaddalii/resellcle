import {Box, IconButton, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import ImageIcon from "@mui/icons-material/Image";
import DefaultImage from "@/public/upload-image.webp";
import {GlobalInterface} from "@/interfaces/global.interface";
import UploadImageCard from "../cards/upload-image.card";

interface Props extends GlobalInterface {
    id: string;
    init?: string;
    disabled: boolean;
    hasError: boolean;
    error: string;
    placeholder?: string;
    onImageSubmit: (file: File) => void;
}

export default function AdImageInput(
    {
        t,
        id,
        init = "",
        disabled,
        hasError,
        error,
        placeholder = t!("placeholders.select_photo"),
        onImageSubmit,
    }: Props
) {

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
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            <UploadImageCard preview={preview} alt={id} base={DefaultImage}/>
            
            <Box sx={{display: "flex", alignItems: "center"}}>
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
                        <ImageIcon width={15} height={15}/>
                        <Typography variant="body1" sx={{mx: "4px"}}>
                            {placeholder}
                        </Typography>
                    </IconButton>
                </label>
            </Box>
            
            {hasError && (
                <Typography variant="caption" sx={{color: "red"}}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
