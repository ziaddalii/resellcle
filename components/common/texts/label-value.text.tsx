import {Container} from "@mui/material";

interface Props {
    label: string;
    value: any;
}

export default function LabelValueText({label, value}: Props) {
    return (
        <div className="col-span-1 py-2">
            <div className="flex gap-1">
                <p className="font-bold">{label}</p>
                <p>{value}</p>
            </div>
        </div>
    );
}
