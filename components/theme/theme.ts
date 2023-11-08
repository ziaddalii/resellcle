import {Cairo} from "next/font/google";
import {createTheme} from "@mui/material/styles";

// const roboto = Roboto({
//     weight: ["300", "400", "500", "700"],
//     subsets: ["latin"],
//     display: "swap",
// });

const cairo = Cairo({
    weight: ["300", "400", "500", "700"],
    subsets: ["arabic", "latin"],
    display: "swap",
});

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#00bf63",
        },
        secondary: {
            main: "#002F34",
        },
    },
    typography: {
        fontFamily: cairo.style.fontFamily,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ownerState}) => ({
                    ...(ownerState.severity === "info" && {
                        backgroundColor: "#FFFFFF",
                    }),
                }),
            },
        },
    },
});

export default theme;
