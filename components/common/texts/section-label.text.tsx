import {Typography} from "@mui/material";

interface Props {
    label: string;
}

export default function SectionLabelText({label}: Props) {
    return (
        <Typography
            color="secondary"
            component="p"
            fontWeight="600"
            variant="h6"
            className="border-b-1 border-b border-solid border-b-gray-200 py-4">
            {label}
        </Typography>
    );
}
