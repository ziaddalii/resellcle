import {TLocalization} from "@/interfaces/global.interface";

export enum NotificationType {
    NEW_CHAT_MESSAGE = "0",
    NEW_AD_COMMENT = "1",
}

export const get_notification_type_name = (type: NotificationType, t: TLocalization) => {
    
    switch (type) {
        case NotificationType.NEW_AD_COMMENT:
            return t("fields.new_comment");
        case NotificationType.NEW_CHAT_MESSAGE:
            return t("fields.new_chat_message");
    }
};

export const get_notification_type_link = (type: NotificationType, ref: string) => {
    
    switch (type) {
        case NotificationType.NEW_AD_COMMENT:
            return `/ads/details/${ref}`;
        case NotificationType.NEW_CHAT_MESSAGE:
            return `/auth/account/messages?chat=${ref}`;
    }
};
