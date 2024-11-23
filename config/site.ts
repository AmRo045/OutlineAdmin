export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Next.js + NextUI",
    description: "Make beautiful websites regardless of your design experience.",
    navItems: [
        {
            label: "Servers",
            href: "/servers"
        },
        {
            label: "Dynamic Access Keys",
            href: "/dynamic-access-keys"
        }
    ],
    links: {
        github: "https://github.com/AmRo045/OutlineAdmin",
        twitter: "https://twitter.com/AmRo045",
        me: "https://amro045.github.io"
    },
    snippets: {
        newOutlineServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"`,
        existingServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/AmRo045/OutlineAdmin/main/access.sh)"`,
        exampleServerConfig: `{"apiUrl":"https://xxx.xxx.xxx.xxx:xxxxx/xxxxxxxxxxxxxxxxxxxxxx","certSha256":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}`
    }
};
