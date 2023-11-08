import { TLocale } from "@/interfaces/global.interface";
import { Button, Container } from "@mui/material";
import Link from "next/link";
export interface LocaleParams {
    params:{
        locale: TLocale;
    }
}
export default async function NotFound() {
  return (
    <Container maxWidth="md">
        <div className="flex md:flex-row flex-col flex-nowrap justify-center items-center p-8 md:gap-0 gap-4 divide-y md:divide-y-0 md:divide-x h-[60vh]">
        <p className="text-8xl md:px-6 md:py-0 py-6">404</p>
        <div className="space-y-4 md:px-6 md:py-0 py-6 md:text-left text-center">
            <p className="text-5xl">Sorry, this page isn&apos;t available!</p>
            <Button component={Link} href="/" variant="contained" sx={{color:"white", fontWeight:"bold"}} className="text-white font-bold">To Home</Button>
        </div>
        </div>
    </Container>
  );
}
