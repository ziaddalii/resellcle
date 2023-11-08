import { Box, Container } from "@mui/material";
import HeaderNavButtons from "@/components/common/buttons/header-nav.buttons";
import { getTranslator } from "next-intl/server";
import { build_meta_data, LocaleParams } from "@/app/[locale]/layout";
import { Metadata } from "next";
import { TLocale } from "@/interfaces/global.interface";
import { get_notifications } from "@/api/requests.api";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import NotificationsTableList from "@/components/common/lists/notifications-table.list";

export async function generateMetadata({ params: { locale } }: { params: LocaleParams }): Promise<Metadata> {
    const t = await getTranslator(locale);
    return build_meta_data(locale, [t("notifications.notifications")]);
}

interface Props {
    params: {
        locale: TLocale;
    };
}

export default async function NotificationsPage({ params: { locale } }: Props) {
    const token = await cookies().get("token");

    if (!token) {
        notFound();
    }

    const t = await getTranslator(locale);

    const notifications = await get_notifications();

    return (
        <Box component="main">
            {/*Nav Header*/}
            <HeaderNavButtons
                items={[{ name: t("notifications.notifications"), link: "/auth/account/notifications" }]}
            />

            <Container maxWidth="xl" component="section" className="space-y-8">
                {/*Table Section*/}
                <NotificationsTableList notifications={notifications.reverse()} locale={locale} />
            </Container>
        </Box>
    );
}
