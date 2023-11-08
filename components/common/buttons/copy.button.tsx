"use client";

import DetailsActionButton from "@/components/common/buttons/details-action.button";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import {useTranslations} from "use-intl";

const copy_to_clipboard = (text: string) => {
    
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand("copy");
        } catch (e) {
        }
        
        document.body.removeChild(textArea);
        return;
    }
    
    navigator.clipboard.writeText(text);
};

interface Props {
    share_link: string;
}

export function CopyButton({share_link}: Props) {
    
    const t = useTranslations();
    
    return (
        <DetailsActionButton
            icon={<FilterNoneIcon/>}
            label={t("fields.copy")}
            action={() => copy_to_clipboard(share_link)}
        />
    );
}
