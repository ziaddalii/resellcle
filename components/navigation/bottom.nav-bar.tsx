import { Box, Button, Container, Grid, MenuItem, Paper } from "@mui/material";
import { NavBarModel } from "@/api/interfaces.api";
import { GlobalInterface } from "@/interfaces/global.interface";
import ListIcon from "@mui/icons-material/List";
import { ReactNode } from "react";
import Link from "next/link";
import { NavToggleButton, sm_nav_state_closed } from "@/components/common/buttons/nav-toggle.button";
import DropDownList from "@/components/common/lists/drop-down.list";

interface Props extends GlobalInterface {
    data: NavBarModel;
}

export default async function BottomNavBarSection({ data, locale, t }: Props) {
    return (
        <Paper
            elevation={1}
            sx={{
                borderRadius: "0",
            }}
            component="section"
            className="p-1.5"
        >
            <Box className="container mx-auto">
                <BottomNavDesktopSection data={data} locale={locale} t={t} />

                <BottomNavMobileSection data={data} locale={locale} t={t} />
            </Box>
        </Paper>
    );
}

export function BottomNavDesktopSection({ data, locale, t }: Props) {
    return (
        <Container
            className="grid grid-cols-6 justify-between items-center"
            sx={{
                display: { lg: "flex", xs: "none" },
            }}
        >
            {/*Categories / Sub Categories*/}
            {data.categories.map((category) => {
                return (
                    <DropDownList
                        key={category.id}
                        trigger={category.names[locale!]}
                        category_name={category.names.en}
                        menu_list={category.sub_categories.map((e) => {
                            return (
                                <a
                                    key={e.id}
                                    href={`/categories/${encodeURIComponent(category.names.en)}/${encodeURIComponent(
                                        e.names.en
                                    )}?page=1`}
                                >
                                    <MenuItem
                                        key={e.id}
                                        sx={{
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {e.names[locale!]}
                                    </MenuItem>
                                </a>
                            );
                        })}
                    />
                );
            })}

            <ItemLink
                with_li={false}
                link="/categories"
                name={t!("fields.all_categories")}
                start_icon={<ListIcon />}
            ></ItemLink>
        </Container>
    );
}

export function BottomNavMobileSection({ data, locale, t }: Props) {
    return (
        <Grid container className="lg:!hidden flex px-4" justifyContent={"space-between"} alignItems={"center"}>
            <Grid
                item
                xs={6}
                sx={{
                    fontWeight:"bold",
                    display: { lg: "none", xs: "flex" },
                }}
            >
                {t!("fields.categories")}
            </Grid>
            <Grid
                item
                xs={6}
                justifyContent={"flex-end"}
                sx={{
                    display: { lg: "none", xs: "flex" },
                }}
            >
                <NavToggleButton />
            </Grid>
            <Grid
                item
                id="sm-nav-menu"
                xs={12}
                sx={{
                    display: { lg: "none", xs: "flex" },
                }}
                className={sm_nav_state_closed}
            >
                <ul className="list-none flex-1 flex-col gap-2 items-center justify-center p-4 text-sm lg:hidden flex">
                    {data.categories.map((e) => {
                        return (
                            <ItemLink
                                key={e.id}
                                link={`/categories/${encodeURIComponent(e.names.en)}?page=1`}
                                name={e.names[locale!]}
                            ></ItemLink>
                        );
                    })}
                    <ItemLink
                        link="/categories"
                        name={t!("fields.all_categories")}
                        start_icon={<ListIcon />}
                    ></ItemLink>
                </ul>
            </Grid>
        </Grid>
    );
}

interface ItemLinkProps {
    link: string;
    name: string;
    start_icon?: ReactNode;
    with_li?: boolean;
}

export function ItemLink({ link, name, start_icon, with_li = true }: ItemLinkProps) {
    const main_body: ReactNode = (
        <Button
            component={Link}
            href={link}
            color="secondary"
            sx={{
                justifyContent: "center",
                width: "100%",
                textTransform: "capitalize",
                borderRadius: "0",
                fontWeight: "normal",
                padding: "15px 7px",
            }}
            startIcon={start_icon}
        >
            {name}
        </Button>
    );

    return with_li ? <li className="w-full">{main_body}</li> : main_body;
}
