// noinspection TypeScriptValidateTypes

import {Box, IconButton, Typography} from "@mui/material";
import {ChangeEvent, useEffect, useState} from "react";
import ImageIcon from "@mui/icons-material/Image";
import DefaultImage from "@/public/upload-image.webp";
import {GlobalInterface} from "@/interfaces/global.interface";
import UploadImageCard from "../cards/upload-image.card";

interface Props extends GlobalInterface {
    id: string;
    init?: string[];
    disabled: boolean;
    hasError: boolean;
    error: string;
    placeholder?: string;
    onImagesSubmit: (files: File[]) => void;
}

export default function AdMultipleImagesInput(
    {
        t,
        id,
        init = ["", "", "", ""],
        disabled,
        hasError,
        error,
        placeholder = t!("placeholders.select_photos"),
        onImagesSubmit,
    }: Props
) {
    
    const [files_list, set_files_list] = useState<string[]>([]);
    const [data_url_from_files, set_data_url_from_files] = useState<string[]>([]);
    const [preview_list, set_preview_list] = useState<string[]>(init ?? []);
    
    const on_images_selected = (e: ChangeEvent<HTMLInputElement>): void => {
        
        if (!e.target.files || !e.target.files[0]) {
            return;
        }
        
        set_files_list(e.target.files);
        
        Promise.all<string[]>(
            Array.from(e.target.files).map((file) => (
                    new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                if (reader.readyState === reader.DONE) {
                                    resolve(reader.result);
                                }
                            };
                            reader.addEventListener("error", reject);
                            reader.readAsDataURL(file);
                        },
                    )
                ),
            ),
        ).then((images) => {
            set_data_url_from_files(images);
        });
    };
    
    useEffect(() => {
        
        if (
            data_url_from_files.length !== files_list.length ||
            files_list.length === 0
        ) {
            return;
        }
        
        set_preview_list(data_url_from_files);
        onImagesSubmit(Object.values(files_list));
        
    }, [data_url_from_files]);
    
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
            
            <Box className="flex flex-wrap items-center justify-center gap-4">
                {preview_list.map(
                    (e, i) => (
                        <UploadImageCard key={`${id}-${i}`} preview={e} alt={id} base={DefaultImage}/>
                    )
                )}
            </Box>
            
            <Box sx={{display: "flex", alignItems: "center"}}>
                <input
                    accept="image/*"
                    multiple
                    id={`icon-button-photos-${id}`}
                    onChange={on_images_selected}
                    type="file"
                    name="photos"
                    hidden
                />
                
                <label htmlFor={`icon-button-photos-${id}`}>
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
