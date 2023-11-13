"use client";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import {Button} from "@mui/material";
import {useTranslations} from "next-intl";
import {useState} from "react";

const PhoneNumberButton = ({phone_number}) => {
    const t = useTranslations();
    
    const [switch_content, set_switch_content] = useState(false);
    return (
        <Button
            className="md:!flex justify-center !hidden gap-2"
            // href={`tel:${phone_number}`}
            // component={"a"}
            onClick={() => set_switch_content(!switch_content)}
            variant="contained"
            sx={{color: "white"}}
            fullWidth
        >
            <LocalPhoneIcon fontSize="small"/>
            {/* {phone_number} */}
            {switch_content ? phone_number : t("fields.phone")}
        </Button>
    );
};

export default PhoneNumberButton;
