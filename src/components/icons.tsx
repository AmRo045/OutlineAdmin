import * as React from "react";

import { IconSvgProps } from "@/src/core/definitions";

export const AmRoLogo: React.FC<IconSvgProps> = ({ size = 36, width, height, ...props }) => (
    <svg height={size || height} width={size || width} {...props} viewBox="0 0 2048 2048">
        <path d="M718.2,1155.4c-101.3-3.9-139.6,10.6-160.1,17.3c-29.9,9.8-52.7,24.3-219.5,119.9C194.4,1375.4,133.4,1420.2,103,1447c-24.5,21.5-49.2,59.7-33.3,91.2c0,0-4.5-20.4,3.3-40.5c7.3-18.7,23.9-38,34.5-46.3c64.1-50,225.6-138.2,474.3,21.4c417.2,267.6,433.7,251.2,569.9,234.5c135.6-16.7,429.9-316.1,429.9-316.1C1328.2,1374.2,1055.4,1168.4,718.2,1155.4z" />
        <path d="M1477.3,1365.6c30.4,12.4,127.1,18,127.1,18s212.5,10.1,309.2-22.5c70.1-23.6,69.7-99,69.7-99s-51.4-336.3-167.2-576.4S1348,373.4,1348,373.4C1653.7,623.7,1477.3,1365.6,1477.3,1365.6z" />
        <path d="M725.2,1145.6c0,0,166.9,8.7,327.7,69.5c125.3,47.4,254.8,98.8,321.2,121.2c71,23.9,94.8,27.6,94.8,27.6s46.8-226.9,50.8-425.1c9-443.6-187.1-565.4-187.1-565.4C905.6,304.3,725.2,1145.6,725.2,1145.6z" />
        <path d="M803.4,860.9c-68.2,172.4-90.9,285.6-90.9,285.6s-54.5-1.1-73.6,0.8c-57.2,5.6-82.4,19.6-82.4,19.6s50.6-410,194.6-564.1c168.6-180.4,405-215.3,405-215.3C968.4,473,864.8,705.5,803.4,860.9z" />
        <path d="M1253.5,360.8c0,0-1.5-10.7,9.2-21.6c10.6-10.9,64.6-6.3,85.7,0c21.1,6.3,16.7,28.6,16.7,28.6C1286.8,353,1253.5,360.8,1253.5,360.8z" />
        <path d="M269.4,1411.5c-218.8,34-206.2,174.8-80.1,163.3c77.5-7,227.8-151.5,227.8-151.5C356.8,1408.5,310.5,1405,269.4,1411.5z" />
    </svg>
);

export const Logo: React.FC<IconSvgProps> = ({ size = 36, width, height, ...props }) => (
    <svg height={size || height} width={size || width} {...props} viewBox="0.00 0.00 96.00 96.00">
        <path
            d="M 40.49 0.00L 41.04 0.00L 41.15 21.31Q 41.16 21.84 40.70 22.10L 22.24 32.83Q 21.74 33.12 21.74 33.69Q 21.76 45.03 21.74 57.30Q 21.73 59.98 22.01 62.69Q 22.06 63.18 22.50 63.43L 40.77 73.91Q 41.23 74.18 41.23 74.71L 41.23 96.00L 40.66 96.00L 3.17 74.44Q 2.75 74.20 2.75 73.71L 2.75 22.70Q 2.75 21.97 3.38 21.60L 40.49 0.00Z"
            fill="#3a745e"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M 74.00 62.74L 74.00 33.15A 0.30 0.30 0.0 0 0 73.85 32.89L 55.40 22.33A 0.30 0.30 0.0 0 1 55.25 22.07L 55.25 0.72A 0.30 0.30 0.0 0 1 55.70 0.46L 92.85 21.76A 0.30 0.30 0.0 0 1 93.00 22.02L 93.00 73.81A 0.30 0.30 0.0 0 1 92.85 74.07L 55.70 95.66A 0.30 0.30 0.0 0 1 55.25 95.40L 55.25 73.99A 0.30 0.30 0.0 0 1 55.40 73.73L 73.85 63.00A 0.30 0.30 0.0 0 0 74.00 62.74Z"
            fill="#5bb193"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const LogoutIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                clipRule="evenodd"
                d="m8.379 2.669l3.69-.58c3.22-.506 4.83-.76 5.88.139C19 3.126 19 4.756 19 8.016V11h-5.92l2.7-3.376l-1.56-1.25l-4 5l-.5.626l.5.624l4 5l1.56-1.25L13.08 13H19v2.983c0 3.26 0 4.89-1.05 5.788c-1.05.898-2.66.645-5.881.14l-3.69-.58c-1.613-.254-2.419-.38-2.899-.942C5 19.828 5 19.012 5 17.38V6.62c0-1.632 0-2.449.48-3.01c.48-.561 1.286-.688 2.899-.941"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export const InfoIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                className="duoicon-secondary-layer"
                d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002c0 5.523-4.478 10.001-10.002 10.001S2 17.524 2 12.001C1.999 6.477 6.476 1.999 12 1.999"
                fill="currentColor"
                opacity=".3"
            />
            <path
                className="duoicon-primary-layer"
                d="M12.001 6.5a1.252 1.252 0 1 0 .002 2.503A1.252 1.252 0 0 0 12 6.5zm-.005 3.749a1 1 0 0 0-.992.885l-.007.116l.004 5.502l.006.117a1 1 0 0 0 1.987-.002L13 16.75l-.004-5.501l-.007-.117a1 1 0 0 0-.994-.882z"
                fill="currentColor"
            />
        </svg>
    );
};

export const UserPasswordIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                d="M12 17v4m-2-1l4-2m-4 0l4 2m-9-3v4m-2-1l4-2m-4 0l4 2m12-3v4m-2-1l4-2m-4 0l4 2M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0m-2 8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const HeartIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" />
        </svg>
    );
};

export const HeartIconDuotone: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                fill="currentColor"
                opacity=".5"
            />
            <path
                d="M16.5 13.287c-2.475-2.716-5.5-.712-5.5 2.112c0 2.56 1.814 4.035 3.358 5.292l.044.036l.427.35c.571.475 1.121.923 1.671.923s1.1-.448 1.671-.923C19.789 19.73 22 18.224 22 15.399c0-.927-.326-1.767-.853-2.38c-1.075-1.251-2.985-1.556-4.647.268"
                fill="currentColor"
            />
        </svg>
    );
};

export const GithubIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
    return (
        <svg height={size || height} viewBox="0 0 256 256" width={size || width} {...props}>
            <g fill="currentColor">
                <path
                    d="M208 104v8a48 48 0 0 1-48 48h-24a32 32 0 0 1 32 32v40h-64v-40a32 32 0 0 1 32-32h-24a48 48 0 0 1-48-48v-8a49.3 49.3 0 0 1 8.51-27.3A51.92 51.92 0 0 1 76 32a52 52 0 0 1 43.83 24h32.34A52 52 0 0 1 196 32a51.92 51.92 0 0 1 3.49 44.7A49.3 49.3 0 0 1 208 104"
                    opacity=".2"
                />
                <path d="M208.3 75.68A59.74 59.74 0 0 0 202.93 28a8 8 0 0 0-6.93-4a59.75 59.75 0 0 0-48 24h-24a59.75 59.75 0 0 0-48-24a8 8 0 0 0-6.93 4a59.78 59.78 0 0 0-5.38 47.68A58.14 58.14 0 0 0 56 104v8a56.06 56.06 0 0 0 48.44 55.47A39.8 39.8 0 0 0 96 192v8H72a24 24 0 0 1-24-24a40 40 0 0 0-40-40a8 8 0 0 0 0 16a24 24 0 0 1 24 24a40 40 0 0 0 40 40h24v16a8 8 0 0 0 16 0v-40a24 24 0 0 1 48 0v40a8 8 0 0 0 16 0v-40a39.8 39.8 0 0 0-8.44-24.53A56.06 56.06 0 0 0 216 112v-8a58 58 0 0 0-7.7-28.32M200 112a40 40 0 0 1-40 40h-48a40 40 0 0 1-40-40v-8a41.74 41.74 0 0 1 6.9-22.48a8 8 0 0 0 1.1-7.69a43.8 43.8 0 0 1 .79-33.58a43.88 43.88 0 0 1 32.32 20.06a8 8 0 0 0 6.71 3.69h32.35a8 8 0 0 0 6.74-3.69a43.87 43.87 0 0 1 32.32-20.06a43.8 43.8 0 0 1 .77 33.58a8.09 8.09 0 0 0 1 7.65a41.76 41.76 0 0 1 7 22.52Z" />
            </g>
        </svg>
    );
};

export const MoonFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="currentColor" fillOpacity="0">
            <path d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z">
                <animate
                    attributeName="fill-opacity"
                    begin="0.7s;lineMdMoonRisingFilledLoop0.begin+6s"
                    dur="0.4s"
                    fill="freeze"
                    id="lineMdMoonRisingFilledLoop0"
                    values="0;1"
                />
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+2.2s"
                    dur="0.4s"
                    fill="freeze"
                    values="1;0"
                />
            </path>
            <path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+3s"
                    dur="0.4s"
                    fill="freeze"
                    values="0;1"
                />
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+5.2s"
                    dur="0.4s"
                    fill="freeze"
                    values="1;0"
                />
            </path>
            <path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z">
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+0.4s"
                    dur="0.4s"
                    fill="freeze"
                    values="0;1"
                />
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+2.8s"
                    dur="0.4s"
                    fill="freeze"
                    values="1;0"
                />
            </path>
            <path d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z">
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+3.4s"
                    dur="0.4s"
                    fill="freeze"
                    values="0;1"
                />
                <animate
                    attributeName="fill-opacity"
                    begin="lineMdMoonRisingFilledLoop0.begin+5.6s"
                    dur="0.4s"
                    fill="freeze"
                    values="1;0"
                />
            </path>
        </g>
        <path
            d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0 22)"
        >
            <animateMotion calcMode="linear" dur="0.6s" fill="freeze" path="M0 0v-22" />
        </path>
    </svg>
);

export const SunFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M12 19v1M19 12h1M12 5v-1M5 12h-1" strokeDasharray="2" strokeDashoffset="2">
                <animate
                    attributeName="d"
                    begin="1.2s"
                    dur="0.2s"
                    fill="freeze"
                    values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
                />
                <animate attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" fill="freeze" values="2;0" />
            </path>
            <path d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5" strokeDasharray="2" strokeDashoffset="2">
                <animate
                    attributeName="d"
                    begin="1.4s"
                    dur="0.2s"
                    fill="freeze"
                    values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
                />
                <animate attributeName="stroke-dashoffset" begin="1.4s" dur="0.2s" fill="freeze" values="2;0" />
            </path>
            <animateTransform
                attributeName="transform"
                dur="30s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
            />
        </g>
        <g fill="currentColor">
            <path d="M15.22 6.03L17.75 4.09L14.56 4L13.5 1L12.44 4L9.25 4.09L11.78 6.03L10.87 9.09L13.5 7.28L16.13 9.09L15.22 6.03Z">
                <animate attributeName="fill-opacity" dur="0.4s" fill="freeze" values="1;0" />
            </path>
            <path d="M19.61 12.25L21.25 11L19.19 10.95L18.5 9L17.81 10.95L15.75 11L17.39 12.25L16.8 14.23L18.5 13.06L20.2 14.23L19.61 12.25Z">
                <animate attributeName="fill-opacity" begin="0.2s" dur="0.4s" fill="freeze" values="1;0" />
            </path>
        </g>
        <path
            d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        >
            <set attributeName="opacity" begin="0.6s" fill="freeze" to="0" />
        </path>
        <mask id="lineMdMoonFilledToSunnyFilledLoopTransition0">
            <circle cx="12" cy="12" fill="#fff" r="12" />
            <circle cx="18" cy="6" fill="#fff" r="12">
                <animate attributeName="cx" begin="0.6s" dur="0.4s" fill="freeze" values="18;22" />
                <animate attributeName="cy" begin="0.6s" dur="0.4s" fill="freeze" values="6;2" />
                <animate attributeName="r" begin="0.6s" dur="0.4s" fill="freeze" values="12;3" />
            </circle>
            <circle cx="18" cy="6" r="10">
                <animate attributeName="cx" begin="0.6s" dur="0.4s" fill="freeze" values="18;22" />
                <animate attributeName="cy" begin="0.6s" dur="0.4s" fill="freeze" values="6;2" />
                <animate attributeName="r" begin="0.6s" dur="0.4s" fill="freeze" values="10;1" />
            </circle>
        </mask>
        <circle
            cx="12"
            cy="12"
            fill="currentColor"
            mask="url(#lineMdMoonFilledToSunnyFilledLoopTransition0)"
            opacity="0"
            r="10"
        >
            <animate attributeName="r" begin="0.6s" dur="0.4s" fill="freeze" values="10;6" />
            <set attributeName="opacity" begin="0.6s" fill="freeze" to="1" />
        </circle>
    </svg>
);

export const ServersIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <defs>
            <path
                d="M20.654 16.88c-.111-1.057-.958-1.88-1.987-1.88c-.845 0-1.568.555-1.861 1.34a2.22 2.22 0 0 0-.015 1.513a1.46 1.46 0 0 0-1.4.49A1.63 1.63 0 0 0 15 19.412c0 .877.672 1.588 1.5 1.588H20c1.105 0 2-.948 2-2.118c0-.927-.562-1.714-1.346-2.001"
                fill="currentColor"
                id="solarServerSquareCloudBold0"
            />
        </defs>
        <path
            clipRule="evenodd"
            d="M3.172 19.828C4.343 21 6.229 21 10 21h3.93a3.17 3.17 0 0 1-.43-1.588c0-.816.32-1.592.857-2.162H13.5a.75.75 0 0 1 0-1.5h1.928c.511-1.29 1.727-2.25 3.239-2.25c1.56 0 2.81 1.028 3.288 2.38l.014.01C22 15.074 22 14.12 22 13v-.25H2V13c0 3.771 0 5.657 1.172 6.828M6 18.25a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 1-.75.75m3 0a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 1-.75.75M3.172 4.172C2 5.343 2 7.229 2 11v.25h20V11c0-3.771 0-5.657-1.172-6.828S17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172M9 9.25a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 1-.75.75M5.25 8.5a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 0-1.5 0zm7.5-1a.75.75 0 0 1 .75-.75H18a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75"
            fill="currentColor"
            fillRule="evenodd"
        />
        <use clipRule="evenodd" fillRule="evenodd" href="#solarServerSquareCloudBold0" />
        <use href="#solarServerSquareCloudBold0" />
    </svg>
);

export const DynamicAccessKeyIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M7 21.5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m10-10a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9M3 8a5 5 0 0 1 5-5h3v2H8a3 3 0 0 0-3 3v3H3zm16 5v3a3 3 0 0 1-3 3h-3v2h3a5 5 0 0 0 5-5v-3z"
            fill="currentColor"
        />
    </svg>
);

export function HealthCheckIcon({ size = 24, width, height, ...props }: IconSvgProps) {
    return (
        <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
            <path
                clipRule="evenodd"
                d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22m2.474-13.581a.75.75 0 0 1 .107 1.055l-5.714 7a.75.75 0 0 1-1.162 0l-2.286-2.8a.75.75 0 0 1 1.162-.948l1.705 2.088l5.133-6.288a.75.75 0 0 1 1.055-.107m4 0a.75.75 0 0 1 .107 1.055l-5.714 7a.75.75 0 0 1-1.21-.064l-.285-.438a.75.75 0 0 1 .88-1.116l5.167-6.33a.75.75 0 0 1 1.055-.107"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
}

export const PlusIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M12 5v14m-7-7h14"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

export const SettingsIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            clipRule="evenodd"
            d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083"
            fill="currentColor"
            fillRule="evenodd"
            opacity=".5"
        />
        <path
            d="M15.523 12c0 1.657-1.354 3-3.023 3s-3.023-1.343-3.023-3S10.83 9 12.5 9s3.023 1.343 3.023 3"
            fill="currentColor"
        />
    </svg>
);

export const DeleteIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M2.75 6.167c0-.46.345-.834.771-.834h2.665c.529-.015.996-.378 1.176-.916l.03-.095l.115-.372c.07-.228.131-.427.217-.605c.338-.702.964-1.189 1.687-1.314c.184-.031.377-.031.6-.031h3.478c.223 0 .417 0 .6.031c.723.125 1.35.612 1.687 1.314c.086.178.147.377.217.605l.115.372l.03.095c.18.538.74.902 1.27.916h2.57c.427 0 .772.373.772.834S20.405 7 19.979 7H3.52c-.426 0-.771-.373-.771-.833"
            fill="currentColor"
        />
        <path
            d="M11.607 22h.787c2.707 0 4.06 0 4.941-.863c.88-.864.97-2.28 1.15-5.111l.26-4.081c.098-1.537.147-2.305-.295-2.792s-1.187-.487-2.679-.487H8.23c-1.491 0-2.237 0-2.679.487s-.392 1.255-.295 2.792l.26 4.08c.18 2.833.27 4.248 1.15 5.112S8.9 22 11.607 22"
            fill="currentColor"
            opacity=".5"
        />
    </svg>
);

export const KeyIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12"
            fill="currentColor"
            opacity=".5"
        />
        <path
            clipRule="evenodd"
            d="M21.963 8.413a5.73 5.73 0 0 1-1.649 3.413a5.75 5.75 0 0 1-5.507 1.504a.9.9 0 0 0-.864.215l-1.53 1.53l-.002-.003l-1.458-1.441a.75.75 0 1 0-1.055 1.066l1.455 1.439l-.503.503a1.23 1.23 0 0 1-1.009.354l-1.74-.194a.82.82 0 0 1-.49-.235l-.174-.174a.82.82 0 0 1-.236-.49l-.193-1.741a1.23 1.23 0 0 1 .353-1.008l3.094-3.094a.9.9 0 0 0 .215-.864a5.75 5.75 0 0 1 1.505-5.507a5.73 5.73 0 0 1 3.413-1.648c.906.033 1.68.096 2.348.215a5.7 5.7 0 0 1 2.378 1.433a5.7 5.7 0 0 1 1.433 2.378c.12.668.182 1.442.216 2.349m-6.975-1.758a1.667 1.667 0 1 1 2.357 2.357a1.667 1.667 0 0 1-2.357-2.357"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

export const CopyIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M6.6 11.397c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c2.715 0 4.073 0 4.916.847c.844.847.844 2.21.844 4.936v4.82c0 2.726 0 4.089-.844 4.936c-.843.847-2.201.847-4.916.847h-2.88c-2.716 0-4.073 0-4.917-.847c-.843-.847-.843-2.21-.843-4.936z"
            fill="currentColor"
        />
        <path
            d="M4.172 3.172C3 4.343 3 6.229 3 10v2c0 3.771 0 5.657 1.172 6.828c.617.618 1.433.91 2.62 1.048c-.192-.84-.192-1.996-.192-3.66v-4.819c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c1.652 0 2.8 0 3.638.19c-.138-1.193-.43-2.012-1.05-2.632C16.657 2 14.771 2 11 2C7.229 2 5.343 2 4.172 3.172"
            fill="currentColor"
            opacity=".5"
        />
    </svg>
);

export const ArrowLeftIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12q0-.2.063-.375T4.7 11.3l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12q0 .425-.288.713T19 13z"
            fill="currentColor"
        />
    </svg>
);

export const EditIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M20.849 8.713a3.932 3.932 0 0 0-5.562-5.561l-.887.887l.038.111a8.754 8.754 0 0 0 2.093 3.32a8.754 8.754 0 0 0 3.43 2.13z"
            fill="currentColor"
            opacity=".5"
        />
        <path
            d="m14.439 4l-.039.038l.038.112a8.754 8.754 0 0 0 2.093 3.32a8.753 8.753 0 0 0 3.43 2.13l-8.56 8.56c-.578.577-.867.866-1.185 1.114a6.554 6.554 0 0 1-1.211.748c-.364.174-.751.303-1.526.561l-4.083 1.361a1.06 1.06 0 0 1-1.342-1.341l1.362-4.084c.258-.774.387-1.161.56-1.525c.205-.43.456-.836.749-1.212c.248-.318.537-.606 1.114-1.183z"
            fill="currentColor"
        />
    </svg>
);

export const InfinityIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M3 12a3.5 3.5 0 0 0 3.5 3.5c1.204 0 2.02-.434 2.7-1.113c.621-.623 1.121-1.44 1.655-2.387c-.534-.947-1.034-1.764-1.656-2.387C8.52 8.933 7.704 8.5 6.5 8.5A3.5 3.5 0 0 0 3 12m3.5 5.5a5.5 5.5 0 1 1 0-11c1.797 0 3.105.691 4.113 1.7c.536.534.987 1.162 1.387 1.802c.4-.64.851-1.268 1.387-1.803C14.395 7.191 15.703 6.5 17.5 6.5a5.5 5.5 0 1 1 0 11c-1.796 0-3.105-.691-4.113-1.7c-.536-.534-.987-1.162-1.387-1.802c-.4.64-.851 1.268-1.387 1.803C9.605 16.809 8.297 17.5 6.5 17.5m6.645-5.5c.534.947 1.034 1.764 1.656 2.387c.68.68 1.496 1.113 2.699 1.113a3.5 3.5 0 1 0 0-7c-1.203 0-2.02.434-2.7 1.113c-.621.623-1.121 1.44-1.655 2.387"
            fill="currentColor"
        />
    </svg>
);

export const BellIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M8.352 20.242A4.63 4.63 0 0 0 12 22a4.63 4.63 0 0 0 3.648-1.758a27.2 27.2 0 0 1-7.296 0M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
            fill="currentColor"
        />
    </svg>
);

export const EyeIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12"
            fill="currentColor"
            opacity=".5"
        />
        <path
            clipRule="evenodd"
            d="M8.25 12a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m1.5 0a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

export const RedditIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 256 256"
        width={size || width}
        {...props}
    >
        <g fill="currentColor">
            <path
                d="M228.21 124.67A51.6 51.6 0 0 1 232 144c0 39.76-46.56 72-104 72S24 183.76 24 144a51.6 51.6 0 0 1 3.79-19.33a24 24 0 1 1 31.62-34.79C77.72 78.75 101.72 72 128 72s50.28 6.75 68.59 17.88a24 24 0 1 1 31.62 34.79"
                opacity=".2"
            />
            <path d="M248 104a32 32 0 0 0-52.94-24.19c-16.75-8.9-36.76-14.28-57.66-15.53l5.19-31.17l17.72 2.72a24 24 0 1 0 2.87-15.74l-26-4a8 8 0 0 0-9.11 6.59l-6.87 41.48c-21.84.94-42.82 6.38-60.26 15.65a32 32 0 0 0-42.59 47.74A59 59 0 0 0 16 144c0 21.93 12 42.35 33.91 57.49C70.88 216 98.61 224 128 224s57.12-8 78.09-22.51C228 186.35 240 165.93 240 144a59 59 0 0 0-2.35-16.45A32.16 32.16 0 0 0 248 104m-64-80a8 8 0 1 1-8 8a8 8 0 0 1 8-8m40.13 93.78a8 8 0 0 0-3.29 10A43.6 43.6 0 0 1 224 144c0 16.53-9.59 32.27-27 44.33C178.67 201 154.17 208 128 208s-50.67-7-69-19.67c-17.41-12.06-27-27.8-27-44.33a43.8 43.8 0 0 1 3.14-16.17a8 8 0 0 0-3.27-10a16 16 0 1 1 21.07-23.24a8 8 0 0 0 10.63 2.12l.18-.11C81.45 85.9 104.25 80 128 80c23.73 0 46.53 5.9 64.23 16.6l.18.11a8 8 0 0 0 10.63-2.12a16 16 0 1 1 21.07 23.19ZM88 144a16 16 0 1 1 16-16a16 16 0 0 1-16 16m96-16a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-16.93 44.25a8 8 0 0 1-3.32 10.82a76.18 76.18 0 0 1-71.5 0a8 8 0 1 1 7.5-14.14a60.18 60.18 0 0 0 56.5 0a8 8 0 0 1 10.82 3.32" />
        </g>
    </svg>
);
