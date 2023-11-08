import {Button, Container, Stack, Typography} from "@mui/material";
import {GlobalInterface} from "@/interfaces/global.interface";
import Link from "next/link";

interface Props extends GlobalInterface {
    show?: boolean;
    current_page: number;
    first_page: number;
    total_pages: number;
    per_page: number;
    total_count: number;
    base_url: string;
    query_builder?: (page) => string
}

export default function PaginationBar(
        {
            show = true,
            base_url,
            first_page,
            current_page,
            total_pages,
            per_page,
            total_count,
            t,
            query_builder,
        }: Props) {

    const showing: number = 1 + (current_page - 1) * per_page;
    const of: number = total_count;
    let to: number = total_count > current_page * per_page ? current_page * per_page : of;

    const links = [];
    for (let i = 1; i <= total_pages; i++) {
        links.push(
                current_page === i ? (
                                <Button variant="contained" sx={{color: "white", minWidth: "0.1rem"}}>{i}</Button>) :
                        (
                                    <Button component={Link} href={`${base_url}?${(query_builder ? query_builder(i) : `page=${i}`)}`} variant="outlined" sx={{minWidth: "0.1rem"}}>{i}</Button>
                        )
        );
    }

    return show ? (
            <Container maxWidth="xl" component="section" className="!flex justify-between items-center">

                <Stack spacing={2} direction="row" className="flex flex-wrap gap-2 flex-justify-start items-center">
                    {...links}
                </Stack>

                <Typography>
                    {t!("fields.showing")} {showing} {t!("fields.to")} {to}{" "}
                    {t!("fields.of")} {of} ({total_pages} {t!("fields.pages")})
                </Typography>

            </Container>
    ) : (<></>);
}
