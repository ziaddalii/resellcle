import * as dayjs from "dayjs";
import {AdsState} from "@/api/interfaces.api";
import {TLocale, TLocalization} from "@/interfaces/global.interface";

export const format_duration_diff_from_months_to_seconds = (timestamp: string, t: TLocalization): number => {
    const months_diff: number = dayjs().diff(dayjs(timestamp), "months");
    if (months_diff !== 0) {
        return t("fields.duration", {duration: months_diff});
    }
    
    const days_diff: number = dayjs().diff(dayjs(timestamp), "days");
    if (days_diff !== 0) {
        return t("fields.duration_in_days", {duration: days_diff});
    }
    
    const hours_diff: number = dayjs().diff(dayjs(timestamp), "hours");
    if (hours_diff !== 0) {
        return t("fields.duration_in_hours", {duration: hours_diff});
    }
    
    const minutes_diff: number = dayjs().diff(dayjs(timestamp), "minutes");
    if (minutes_diff !== 0) {
        return t("fields.duration_in_minutes", {duration: minutes_diff});
    }
    
    const seconds_diff: number = dayjs().diff(dayjs(timestamp), "seconds");
    return t("fields.duration_in_seconds", {duration: seconds_diff});
};

export const format_page_num = (page: string): number => {
    
    const parsed_page = parseInt(page);
    
    if (isNaN(parsed_page)) {
        return 1;
    }
    
    return parsed_page;
};

export const get_ad_state_text = (state: AdsState) => {
    switch (state) {
        case AdsState.NEW:
            return "fields.new";
        case AdsState.PAID:
            return "fields.paid";
        case AdsState.PINNED:
            return "fields.pinned";
    }
};

export const format_date = (date_string, template = "DD/MM/YYYY") => {
    return dayjs(date_string).format(template);
};

export const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

export const get_request_errors = (e: any, locale: TLocale) => {
    
    if (e.errors && Array.isArray(e.errors)) {
        return e.errors.join(", ");
    }
    
    if (e.message) {
        return e.message;
    }
    
    return locale === "ar" ?
        "حدث خطأ غير متوقع" :
        "Unexpected Error Occurred";
};

export const build_query_params = (payload: object) => {
    
    if (Object.keys(payload).length === 0) {
        return "";
    }
    
    return Object.keys(payload).map((k) => `${k}=${payload[k]}`).join("&");
};

export const print_form_data = (form_data: FormData) => {
    for (const [key, value] of form_data.entries()) {
        console.log(`${key}, ${value}`);
    }
};
