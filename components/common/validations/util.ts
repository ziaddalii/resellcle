"use client";
import {TLocalization} from "@/interfaces/global.interface";

export const emailMsg = (property: string, t: TLocalization) => {
    return {
        message: t(
            "validations.email",
            {
                property: t(property),
            },
        ),
    };
};

export const minLengthMsg = (min: number, property: string, t: TLocalization) => {
    return {
        message: t(
            "validations.minLength",
            {
                property: t(property),
                min,
            },
        ),
    };
};

export const maxLengthMsg = (max: number, property: string, t: TLocalization) => {
    return {
        message: t(
            "validations.maxLength",
            {
                property: t(property),
                max,
            },
        ),
    };
};

export const passwordConfirmMsg = (property: string, t: TLocalization) => {
    return {
        message: t(
            "validations.sameAsPassword",
            {
                property: t(property),
            },
        ),
    };
};

export const hasError = (errors: object, key: string) => Object.hasOwn(errors, key);

export const getError = (errors: Record<string, any>, key: string) => {
    if (errors[key] && Array.isArray(errors[key])) {
        return errors[key][0]?.message ?? "";
    }
    
    return errors[key] && errors[key].message ? errors[key].message : "";
};

export const requiredMsg = (property: string, t: TLocalization) => {
    return {
        message: t(
            "validations.required",
            {
                property: t(property),
            },
        ),
    };
};
