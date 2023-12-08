import { Box, Button, MenuItem, Typography } from "@mui/material";
import DropDownList from "../lists/drop-down.list";
import Image from "next/image";
// import Link from "next-intl/link";
import { CategoryModel } from "@/api/interfaces.api";
import { GlobalInterface } from "@/interfaces/global.interface";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

export interface Props extends GlobalInterface {
    name: string;
    photo_url: string;
    sub_categories: {
        id: string;
        name: string;
        names: {
            en: string;
            ar: string;
        };
        icon_url: string;
        super_category: object;
        filters_choices: object[];
        created_at: string;
    }[];
    category: CategoryModel;
}

export default function CategoryCard({ name, photo_url, sub_categories, locale, category }: Props) {
    return (
        <Box className="flex items-center gap-2 justify-start px-4 py-2">
            <DropDownList
                slug={category.slug}
                category_name={category.names.en}
                menu_list={sub_categories.map((item) => {
                    return (
                        <a
                            key={item.id}
                            href={`/categories/${encodeURIComponent(category.slug)}/${encodeURIComponent(
                                item.slug
                            )}?page=1`}
                        >
                            <MenuItem>{item.names[locale!]}</MenuItem>
                        </a>
                    );
                })}
                trigger={
                    <div className="sm:flex block md:justify-start justify-center items-center min-w-[60px] gap-4">
                        <div className="flex-none">
                            <Image
                                width={60}
                                height={60}
                                className="aspect-1 rounded-full w-[60px] h-[60px] object-cover"
                                src={photo_url}
                                alt={name}
                            />
                        </div>
                        <Typography>{name}</Typography>
                    </div>
                }
            />
        </Box>
    );
}
