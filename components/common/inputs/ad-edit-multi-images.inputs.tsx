// noinspection TypeScriptValidateTypes

import {Box, Divider, IconButton, Typography} from "@mui/material";
import DefaultImage from "@/public/upload-image.webp";
import {GlobalInterface} from "@/interfaces/global.interface";
import EditImageCard from "@/components/common/cards/edit-image.card";
import {Photo, PhotoFull} from "@/api/interfaces.api";
import {ChangeEvent, useEffect, useState} from "react";
import CommonUtil from "@/util/common";
import AddIcon from "@mui/icons-material/Add";
import UploadImageCard from "@/components/common/cards/upload-image.card";

interface Props extends GlobalInterface {
    id: string;
    init?: {
        id: string;
        url: string;
    }[];
    disabled: boolean;
    hasError: boolean;
    error: string;
    placeholder?: string;
    onImagesAddSubmit: (files: File[]) => void;

    onImagesUpdateSubmit: (photo: Photo[]) => void;

    onImagesDeleteSubmit: (id: string) => void;
}

export default function AdEditMultipleImagesInput(
        {
            t,
            id,
            init = [],
            disabled,
            hasError,
            error,
            placeholder = t!("placeholders.select_photos"),
            onImagesAddSubmit,
            onImagesUpdateSubmit,
            onImagesDeleteSubmit,
        }: Props
) {

    const [current_photos, set_current_photos] = useState<PhotoFull[]>(init);

    const [new_files_list, set_new_files_list] = useState([]);
    const [data_url_from_files, set_data_url_from_files] = useState<string[]>([]);
    const [new_preview_list, set_new_preview_list] = useState<string[]>([]);

    const on_images_selected = (e: ChangeEvent<HTMLInputElement>): void => {

        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        set_new_files_list(e.target.files);

        const new_read_list = [];

        for (let i = 0; i < e.target.files.length; i++) {

            CommonUtil.read_file_as_data_url(e.target.files[i], (new_data_url) => {
                new_read_list[i] = new_data_url;
                set_data_url_from_files(new_read_list);
            });
        }
    };

    useEffect(() => {

        if (
                data_url_from_files.length !== new_files_list.length ||
                new_files_list.length === 0
        ) {
            return;
        }

        set_new_preview_list(data_url_from_files);
        onImagesAddSubmit(Object.values(new_files_list));

    }, [data_url_from_files]);

    const on_update = (id: string, index: string, file: File) => {

        CommonUtil.read_file_as_data_url(file, (new_data_url) => {

            const new_current_photos = [...current_photos];

            new_current_photos[index].url = new_data_url;
            set_current_photos(new_current_photos);

            onImagesUpdateSubmit({
                id,
                photo: file,
            });

        });
    };

    const on_delete = (id: string, index: number) => {

        const new_current_photos = [...current_photos];

        new_current_photos.splice(index, 1);

        set_current_photos(new_current_photos);

        onImagesDeleteSubmit(id);
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

                <Box className="flex flex-wrap items-center justify-center gap-4">
                    {current_photos.map(
                            (e, i) => (
                                    <EditImageCard
                                            key={`${id}-${i}`}
                                            id={`${id}-${i}`}
                                            preview={e.url}
                                            alt={id}
                                            base={DefaultImage}
                                            onEdit={(file: File) => on_update(e.id, i, file)}
                                            onDelete={() => on_delete(e.id, i)}
                                            disabled={disabled}
                                    />
                            )
                    )}
                </Box>

                <Divider/>

                <Box className="flex flex-wrap items-center justify-center gap-4">
                    {new_preview_list.map(
                            (e, i) => (
                                    <UploadImageCard
                                            key={`${id}-${i}`}
                                            preview={e}
                                            alt={id}
                                            base={DefaultImage}
                                    />
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
                        <IconButton disabled={disabled} color="primary" component="div"
                                    className="border-2 border-primary rounded-full">
                            <AddIcon width={15} height={15}/>
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
