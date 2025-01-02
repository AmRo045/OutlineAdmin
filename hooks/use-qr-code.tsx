import QRCodeStyling, { Options } from "qr-code-styling";
import { MutableRefObject } from "react";

const defaultOptions: Partial<Options> = {
    width: 264,
    height: 264,
    margin: 2,
    qrOptions: {
        typeNumber: 8,
        mode: "Byte",
        errorCorrectionLevel: "L"
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 6
    },
    dotsOptions: {
        type: "extra-rounded",
        color: "gray"
    },
    backgroundOptions: {
        color: "transparent"
    },
    cornersSquareOptions: {
        type: "dot",
        color: "gray"
    },
    cornersDotOptions: {
        color: "gray"
    }
};

export default function useQrCode(
    containerElRef: MutableRefObject<HTMLElement | null>,
    logoPath: string = "/favicon.svg"
) {
    return (data: string | undefined) => {
        const bodyCss = getComputedStyle(document.documentElement);
        const textBrush = bodyCss.getPropertyValue("--qr-code-text").trim();

        const qrCodeOptions: Partial<Options> = {
            ...defaultOptions,
            dotsOptions: { ...defaultOptions.dotsOptions, color: textBrush },
            cornersSquareOptions: { ...defaultOptions.cornersSquareOptions, color: textBrush },
            cornersDotOptions: { ...defaultOptions.cornersDotOptions, color: textBrush }
        };

        const qrCode = new QRCodeStyling({
            data,
            image: logoPath,
            ...qrCodeOptions
        });

        if (containerElRef.current) {
            containerElRef.current.innerHTML = "";
            qrCode.append(containerElRef.current);
        }
    };
}
