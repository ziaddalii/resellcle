import {z} from "zod";
import {TLocalization} from "@/interfaces/global.interface";
import {requiredMsg} from "@/components/common/validations/util";

export interface Photo {
    id?: string;
    
    photo?: File;
}

//CONFIG
const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

//VALIDATIONS
export const zPhoto = (
    is_required = false,
    key: string,
    t: TLocalization,
) => {
    
    const schema = z.custom<File | Photo>(
        (d: unknown) => d instanceof File || (d.id && d.photo),
        requiredMsg(key, t),
    ).refine(
        (file: File | Photo) => {
            const fileSize =
                (file instanceof File ? file.size : file.photo?.size) ?? 0;
            
            return fileSize <= MAX_FILE_SIZE;
        },
        {
            message: t("validations.photoSize"),
        },
    ).refine(
        (file: File | Photo) => {
            const fileType =
                (file instanceof File ? file.type : file.photo?.type) ?? "";
            
            return ACCEPTED_IMAGE_TYPES.includes(fileType);
        },
        {
            message: t("validations.photoType"),
        },
    );
    
    return is_required ?
        z.union([z.string().min(1, {
            message: t("validations.photoType"),
        }), schema]) :
        z.optional(z.union([z.string(), schema]));
};

export const zPhotos = (is_required: boolean, key: string, t: TLocalization) => {
    const zodPhoto = zPhoto(is_required, key, t);
    
    return is_required ?
        z.union([z.string(), z.array(zodPhoto)]) :
        z.optional(z.union([z.string(), z.array(zodPhoto)]));
};
