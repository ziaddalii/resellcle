"use client";

import Link from "next-intl/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { Button, Typography } from "@mui/material";
import flag_ar from "@/public/navbar/ar.png";
import flag_en from "@/public/navbar/en.png";
import { useSearchParams } from "next/navigation";

export default function ChangeLocaleButton() {
    
    //LOCALE
    const current_locale = useLocale();
    const other_locale = current_locale === "en" ? "ar" : "en";
    const other_flag = current_locale === "en" ? flag_ar : flag_en;
    const t = useTranslations();
    
    //ROUTE
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current_url = `${pathname}?${searchParams}`;

    return (
            
            <Button component={Link} locale={other_locale} href={current_url} color="secondary" className="flex items-center gap-2 h-[2.5rem] !min-w-[90px]" variant="outlined">
                <Image
                    src={other_flag}
                    alt={`locale-${other_locale}`}
                    className="object-contain inline min-h-[0.5rem] w-auto"
                />

                <Typography fontWeight="600">{t("fields.language")} </Typography>
            </Button>
    );
}
