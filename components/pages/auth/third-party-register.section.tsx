import {Box, Grid} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import ThirdPartyButton from "@/components/common/buttons/third-party.button";
import Google from "@/public/social-media/google_white.webp";
import Facebook from "@/public/social-media/facebook_white.webp";
import Twitter from "@/public/social-media/twitter_x_white.webp";
import {GlobalInterface} from "@/interfaces/global.interface";

interface Props extends GlobalInterface {}

export const third_parties = [
    {
        img_url: Google,
        title: "Google",
    },
    {
        img_url: Facebook,
        title: "Facebook",
    },
    {
        img_url: Twitter,
        title: "Twitter / X",
    },
];

export function ThirdPartyRegisterSection({t}: Props) {
    return (
            <Grid component="section" className="space-y-4">
                <Box className="flex gap-2">
                    <KeyIcon/>
                    <p className="font-bold">{t!("login.you_can_login_with")}</p>
                </Box>

                <Grid container columnSpacing={4} spacing={2}>
                    {third_parties.map((item, i) => {
                        return <ThirdPartyButton key={i} img_url={item.img_url} title={item.title}/>;
                    })}
                </Grid>

            </Grid>
    );
}
