"use server";

import DropDownMyAccountList from "@/components/common/lists/dropdown-my-account.list";
import { Button, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import { GlobalInterface } from "@/interfaces/global.interface";
import { cookies } from "next/headers";

interface Props extends GlobalInterface {}

export default async function AuthButtonsBar({ t }: Props) {
    return cookies().has("token") ? (
        <DropDownMyAccountList trigger={t!("fields.my_account")} />
    ) : (
        <div className="flex gap-2">
            {/*Register*/}
            <Button
                component="a"
                href="/auth/register"
                color="secondary"
                variant="contained"
                className="flex gap-1 items-center max-h-[2.5rem] h-full"
            >
                <PersonAddIcon fontSize="small" />
                <Typography fontWeight="500">{t!("fields.sign_up")} </Typography>
            </Button>

            {/*Login*/}
            <Button
                href="/auth/login"
                component="a"
                color="secondary"
                variant="contained"
                className="flex gap-1 items-center max-h-[2.5rem] h-full"
            >
                <PersonIcon fontSize="small" />
                <Typography fontWeight="500">{t!("fields.login")} </Typography>
            </Button>
        </div>
    );
}
