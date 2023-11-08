"use client";
import {Button} from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import {useEffect, useState} from "react";

export const scroll_to_top = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

export const scroll_to = (dom_id: string) => {
    
    const element = document.getElementById(dom_id);
    
    if (!element) {
        return;
    }
    
    const y = element.getBoundingClientRect().top + window.scrollY;
    
    window.scroll({
        top: y,
        behavior: "smooth",
    });
};

export default function FloatingArrowButton() {
    
    const [isTop, setIsTop] = useState<boolean>(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop == 0) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }
        };
        
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    
    return (
        <Button
            onClick={scroll_to_top}
            size="small"
            aria-label="fly to top"
            className={`${
                isTop ? "!hidden" : "!flex"
            } !fixed sm:!bottom-8 !bottom-16 !right-8 !p-2 justify-center items-center !bg-[#002f34] !border-1 !border-solid !border-white !border !min-w-0`}
        >
            <NavigationIcon className="text-white" fontSize="small"/>
        </Button>
    );
}
