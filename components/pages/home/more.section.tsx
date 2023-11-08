import {Container} from "@mui/material";
import ViewMoreButton from "@/components/common/buttons/view-more.button";
import Link from "next/link";

export default async function HomeMoreSection() {
    return (
        <Container component="section" className="!flex items-center justify-center">
            <Link href="/ads/new?page=1">
                <ViewMoreButton/>
            </Link>
        </Container>
    );
}
