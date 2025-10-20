export const PAGE_SIZE = 30;
export const MAX_DATA_LIMIT_FOR_ACCESS_KEYS = 100_000_000;
export const BYTES_TO_MB_RATE = 1000 * 1000;
export const HEALTH_CHECK_DEFAULT_INTERVAL = 1; // minute
export const HEALTH_CHECK_DEFAULT_NOTIFICATION_COOLDOWN = 30; // minute

export const AUTH_SESSION_KEY = "oa-auth-session";

export const ADMIN_PASSWORD_ROUTE = "/admin";
export const LOGIN_ROUTE = "/";
export const HOME_ROUTE = "/servers";

export const app = {
    name: "Outline Admin",
    description:
        "Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN servers.",

    links: {
        github: "https://github.com/AmRo045/OutlineAdmin",
        x: "https://x.com/AmRo045",
        me: "https://amro045.github.io",
        outlineVpnWiki: {
            index: "https://www.reddit.com/r/outlinevpn/wiki/index",
            dynamicAccessKeys: "https://developers.google.com/outline/docs/guides/service-providers/dynamic-access-keys"
        },
        myTelegramApiProxyWorkerRepo: "https://github.com/AmRo045/telegram-api-proxy-worker"
    },

    snippets: {
        newOutlineServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"`,
        existingServer: `sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/AmRo045/outline-admin/main/access.sh)"`,
        exampleServerManagementJson: `{"apiUrl":"https://xxx.xxx.xxx.xxx:xxxxx/xxxxxxxxxxxxxxxxxxxxxx","certSha256":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}`
    },

    donation: {
        BTC: "bc1qjmnnw4779ntv08uuqmpqnx7hqmygl08z4z500a",
        USDT: "0xCcF2117F837b16fbc0FbDe0178De0a2aCbfadC58",
        ETH: "0xCcF2117F837b16fbc0FbDe0178De0a2aCbfadC58",
        TON: "UQByW0gL9r89D4oFagC3ZRCEctIoh6XjHu7zv5xU2wcPVATT"
    }
};
