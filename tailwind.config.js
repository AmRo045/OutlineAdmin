import { heroui } from "@heroui/theme";

/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#549a7f",
                    50: "#eef5f2",
                    100: "#ddebe5",
                    200: "#bbd7cc",
                    300: "#98c2b2",
                    400: "#76ae99",
                    500: "#549a7f",
                    600: "#437b66",
                    700: "#325c4c",
                    800: "#223e33",
                    900: "#111f19"
                }
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                system: ["system-ui"],
                cursive: ["cursive"]
            }
        }
    },
    darkMode: "class",
    plugins: [
        heroui({
            themes: {
                dark: {
                    colors: {
                        default: {
                            50: "#0a0a0c",
                            100: "#141419",
                            200: "#1f1f25",
                            300: "#292932",
                            400: "#33333e",
                            500: "#5c5c65",
                            600: "#85858b",
                            700: "#adadb2",
                            800: "#d6d6d8",
                            900: "#ffffff",
                            foreground: "#fff",
                            DEFAULT: "#33333e"
                        },
                        primary: {
                            50: "#162822",
                            100: "#233f36",
                            200: "#305649",
                            300: "#3d6d5d",
                            400: "#4a8471",
                            500: "#6a9a8a",
                            600: "#89afa3",
                            700: "#a9c5bc",
                            800: "#c9dad4",
                            900: "#e8f0ed",
                            foreground: "#000",
                            DEFAULT: "#4a8471"
                        },
                        secondary: {
                            50: "#133144",
                            100: "#1e4d6c",
                            200: "#2a6994",
                            300: "#3586bb",
                            400: "#40a2e3",
                            500: "#61b2e8",
                            600: "#83c3ed",
                            700: "#a4d3f2",
                            800: "#c6e3f7",
                            900: "#e7f3fc",
                            foreground: "#000",
                            DEFAULT: "#40a2e3"
                        },
                        success: {
                            50: "#1b412b",
                            100: "#2a6644",
                            200: "#3a8c5e",
                            300: "#49b177",
                            400: "#59d790",
                            500: "#76dea3",
                            600: "#93e5b7",
                            700: "#b0ecca",
                            800: "#cdf3de",
                            900: "#eafaf1",
                            foreground: "#000",
                            DEFAULT: "#59d790"
                        },
                        warning: {
                            50: "#392b13",
                            100: "#5b431e",
                            200: "#7c5c2a",
                            300: "#9e7535",
                            400: "#bf8e40",
                            500: "#caa261",
                            600: "#d5b683",
                            700: "#e1c9a4",
                            800: "#ecddc6",
                            900: "#f7f1e7",
                            foreground: "#000",
                            DEFAULT: "#bf8e40"
                        },
                        danger: {
                            50: "#431424",
                            100: "#6a1f39",
                            200: "#922a4f",
                            300: "#b93664",
                            400: "#e04179",
                            500: "#e56290",
                            600: "#eb84a8",
                            700: "#f0a5bf",
                            800: "#f6c6d7",
                            900: "#fbe7ee",
                            foreground: "#000",
                            DEFAULT: "#e04179"
                        },
                        background: "#050506",
                        foreground: "#f7f7f8",
                        content1: {
                            DEFAULT: "#0e0e11",
                            foreground: "#fff"
                        },
                        content2: {
                            DEFAULT: "#17171c",
                            foreground: "#fff"
                        },
                        content3: {
                            DEFAULT: "#202027",
                            foreground: "#fff"
                        },
                        content4: {
                            DEFAULT: "#292932",
                            foreground: "#fff"
                        },
                        focus: "#7b9796",
                        overlay: "#3c3c49"
                    }
                }
            },
            layout: {
                disabledOpacity: "0.8"
            }
        })
    ]
};
