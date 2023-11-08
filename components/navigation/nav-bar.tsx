import TopNavBarSection from "@/components/navigation/top.nav-bar";
import BottomNavBarSection from "@/components/navigation/bottom.nav-bar";
import {NavBarModel} from "@/api/interfaces.api";
import {getTranslator} from "next-intl/server";
import {GlobalInterface} from "@/interfaces/global.interface";
import {GlobalProgressBarNotification} from "@/components/common/notifications/global-progress-bar.notification";

interface Props extends GlobalInterface {
    data: NavBarModel
}

export default async function NavBar({locale, data}: Props) {
    const t = await getTranslator(locale as string);

    return (
            <nav>
                <TopNavBarSection t={t}/>
                <BottomNavBarSection locale={locale} data={data} t={t}/>
                <GlobalProgressBarNotification/>
            </nav>
    );
}
