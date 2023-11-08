"use client";

import Carousel, {ArrowProps} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {Container} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
interface Props {
    children:ReactNode;
}

export default function ImagesCarousel({ children }: Props) {
    const CustomLeftArrow = ({onClick}: ArrowProps) => {
        return (
            <ArrowBackIcon
                fontSize={"large"}
                onClick={onClick}
                className="w-8 absolute left-8 top-1/2 translate-y-[-50%] aspect-square cursor-pointer rounded-full bg-black/10 p-2 text-white"
            />
        );
    };

    const CustomRightArrow = ({onClick}: ArrowProps) => {
        return (
            <ArrowForwardIcon
            fontSize={"large"}

                onClick={onClick}
                className="w-8 absolute right-8 top-1/2 translate-y-[-50%] aspect-square cursor-pointer rounded-full bg-black/10 p-2 text-white"
            />
        );
    };
    const [showDots, setShowDots] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            // Adjust the breakpoint as needed
            if (window.innerWidth <= 768) {
                setShowDots(false);
            } else {
                setShowDots(true);
            }
        };

        // Initial check and add resize event listener
        handleResize();

        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="relative">
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlay
                autoPlaySpeed={3000}
                centerMode={false}
                className="mx-auto"
                containerClass="container"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                keyBoardControl
                minimumTouchDrag={80}
                pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside
                responsive={{
                    desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024,
                        },
                        items: 1,
                    },
                    mobile: {
                        breakpoint: {
                            max: 464,
                            min: 0,
                        },
                        items: 1,
                    },
                    tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 464,
                        },
                        items: 1,
                    },
                }}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay
                showDots={showDots}
                slidesToSlide={1}
                swipeable
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
            >
                {children}
            </Carousel>
        </div>
    );
}
