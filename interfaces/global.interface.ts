export interface GlobalInterface {
    locale?: TLocale;
    t?: TLocalization;
}

export type TLocale = "en" | "ar";
export type TLocalization = (string, any?) => any
