import TopFooterSection from "@/components/footer/top.footer";
import {FooterModel} from "@/api/interfaces.api";
import {GlobalInterface} from "@/interfaces/global.interface";
import {getTranslator} from "next-intl/server";
import BottomFooterSection from "@/components/footer/bottom.footer";

interface Props extends GlobalInterface {
    data: FooterModel;
}

export default async function Footer({locale, data}: Props) {
    
    const t = await getTranslator(locale as string);
    
    return (
        <footer>
            <TopFooterSection locale={locale} t={t} regions={data.regions} categories={data.categories}/>
            <BottomFooterSection t={t}/>
        </footer>
    );
}
