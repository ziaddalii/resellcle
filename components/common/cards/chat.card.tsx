import {CardActionArea} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface Props {
    chat_id: string;
    chat_image: string;
    chat_user: string;
    chat_ad: string;
    last_message: string;
    last_message_date: number;
    is_selected: boolean;
};

const ChatCard = (
    {
        chat_id,
        is_selected = false,
        chat_image,
        chat_user,
        chat_ad,
        last_message,
        last_message_date,
    }: Props) => {
    return (
        <CardActionArea sx={{marginBottom: "1rem"}}>
            <Link href={`?chat=${chat_id}`}>
                <article
                    className={"grid grid-cols-4 animate items-center justify-between gap-2 p-4 " + (is_selected ? "border-2 border-primary-500" : "")}>
                    
                    <div className="col-span-1 sm:h-[82px] sm:w-[82px] h-[50px] w-[50px]">
                        <img className="object-cover w-full h-full rounded-full" src={chat_image} alt={chat_ad}/>
                    </div>
                    
                    <div className="col-span-2">
                        <strong>{chat_user}</strong>
                        <p>{chat_ad}</p>
                        <p className="color-secondary">{last_message}</p>
                    </div>
                    
                    <div className="grid h-full col-span-1 items-center justify-center">
                        
                        <p className="text-xs">{last_message_date}</p>
                        
                        {/*<DeleteIcon/>*/}
                    
                    </div>
                
                </article>
            </Link>
        </CardActionArea>
    );
};

export default ChatCard;
