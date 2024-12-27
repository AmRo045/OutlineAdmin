import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const AUTH_SESSION_KEY = "oa-auth-session";

export const ADMIN_PASSWORD_ROUTE = "/admin";
export const LOGIN_ROUTE = "/";
export const HOME_ROUTE = "/servers";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono"
});

export const app = {
    fonts: {
        fontSans,
        fontMono
    },

    links: {
        github: "https://github.com/AmRo045/OutlineAdmin",
        x: "https://x.com/AmRo045",
        me: "https://amro045.github.io"
    },

    snippets: {
        newOutlineServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"`,
        existingServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/AmRo045/OutlineAdmin/main/access.sh)"`,
        exampleServerManagementJson: `{"apiUrl":"https://xxx.xxx.xxx.xxx:xxxxx/xxxxxxxxxxxxxxxxxxxxxx","certSha256":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}`
    }
};
