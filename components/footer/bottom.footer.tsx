import { Box, Container } from "@mui/material";
import Facebook from "@/public/footer/facebook.png";
import Twitter from "@/public/footer/twitter.png";
import Tiktok from "@/public/footer/tiktok.png";
import SocialButton from "@/components/common/buttons/social.button";
import { GlobalInterface } from "@/interfaces/global.interface";

interface Props extends GlobalInterface {}

export default async function BottomFooterSection({ t }: Props) {
    return (
        <Box component="section" className="bg-[#002f34] text-white">
            <Container maxWidth="md">
                <Box className="flex flex-wrap md:justify-between justify-center gap-4 items-center py-4">
                    <Box className="flex flex-wrap justify-between gap-2">
                        <SocialButton alt="facebook" link="https://www.facebook.com/Resellcle" img_url={Facebook} />

                        <SocialButton alt="twitter-x" link="https://twitter.com/Resellcle" img_url={Twitter} />

                        <SocialButton alt="tiktok" link="https://www.tiktok.com/@Resellcle" img_url={Tiktok} />
                    </Box>
                    <p> {t!("app.name")} © 2023</p>
                    <p>
                        <span>{t("footer.designed_by")} </span>
                        <a
                            target="_blank"
                            href="https://icon-ts.com"
                            rel="noopener noreferrer"
                            className="text-blue-500 font-bold"
                        >
                            Icon
                        </a>
                    </p>
                </Box>
            </Container>
        </Box>
    );
}
