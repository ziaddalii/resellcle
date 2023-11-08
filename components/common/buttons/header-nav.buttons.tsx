import {Box, Button} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {SwitchRight} from "@mui/icons-material";

interface Props {
    items: {
        name: string;
        link: string;
    }[];
}

export default function HeaderNavButtons({items = []}: Props) {
    return (
        <Box className="bg-secondary-100 mx-auto">
            <Box className="flex items-center gap-4 p-4">
                
                <Button color="secondary" href="/">
                    <HomeIcon/>
                </Button>
                
                {items.map((item, i) => (
                    <HeaderItem key={i} name={item.name} link={item.link}
                                with_separator={i !== items.length - 1}/>
                ))}
            
            </Box>
        </Box>
    );
}

interface HeaderItemProps {
    name: string;
    link: string;
    with_separator: boolean
}

function HeaderItem({name, link, with_separator = true}: HeaderItemProps) {
    return (
        <>
            <Button
                color={with_separator ? "secondary" : "primary"}
                href={link}>
                {name}
            </Button>
            {with_separator && <SwitchRight/>}
        </>
    );
}
