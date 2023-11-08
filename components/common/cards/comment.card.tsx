import {Avatar, Box, Card} from "@mui/material";

export interface Props {
    id: string;
    name: string;
    photo_url: string;
    body: string;
}

export default function CommentCard({id, name, photo_url, body}: Props) {
    return (
        <Card id={id} component="div" className="my-4 p-4 space-y-2 !bg-secondary-100 border border-solid border-1 !rounded-none">
            
            <Box display="flex" alignItems="center" gap={1}>

                <Avatar alt={name} src={photo_url}/>
                
                <p className="font-bold capitalize">{name}</p>

            </Box>
            
            <p>{body}</p>
            
        </Card>
    );
}
