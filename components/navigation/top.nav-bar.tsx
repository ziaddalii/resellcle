import { Button, Typography } from "@mui/material";
import Logo from "@/public/logo.webp";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Link from "next/link";
import ChangeLocaleButton from "@/components/common/buttons/change-locale.button";
import { GlobalInterface } from "@/interfaces/global.interface";
import AuthButtonsBar from "@/components/navigation/auth-buttons-bar";
import SearchInput from "../common/inputs/search.inputs";
import NotificationButton from "@/components/common/buttons/notification.button";
import { cookies } from "next/headers";

interface Props extends GlobalInterface {}

export default function TopNavBarSection({ t }: Props) {
    const token = cookies().has("token")
    return (
        <section className="bg-secondary-100 p-4 grid grid-cols-12 gap-2 items-center">
            {/*Logo*/}
            <div className="col-span-12 md:col-span-3 flex justify-center">
                    <Button component={Link}  href="/" className="p-2">
                        <Image
                            priority={true}
                            src={Logo}
                            alt="resellcle logo"
                            className="max-h-[5rem] w-auto object-contain"
                        ></Image>
                    </Button>
            </div>

            {/*Search Input*/}
                <SearchInput />

            {/*Buttons*/}
            <div className="space-y-2 col-span-12 lg:col-span-4 xl:col-span-3 mx-auto">
                <div className="flex gap-2">
                    {/*Locale*/}
                    <ChangeLocaleButton />

                    {/*Login / Register / Account*/}
                    <AuthButtonsBar t={t} />
                </div>

                <div className="flex flex-grow items-center sm:flex-grow-0 gap-2">
                    <Button
                        href="/auth/account/ads/new"
                        component={"a"}
                        variant="contained"
                        color="primary"
                        className="gap-1 flex flex-1 px-2 !text-white items-center h-[2.6rem] w-[75%]"
                    >
                        <div>
                            <AddIcon fontSize="small" />
                            <CameraAltIcon fontSize="small" />
                        </div>
                        <Typography fontWeight="500">{t!("top_navbar.ad")}</Typography>
                    </Button>
                    {token && <NotificationButton />}
                    
                </div>
            </div>
        </section>
    );
}
