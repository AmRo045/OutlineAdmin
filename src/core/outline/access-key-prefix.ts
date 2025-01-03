import { AccessKeyPrefixData, AccessKeyPrefixType } from "@/src/core/definitions";

export const AccessKeyPrefixes: AccessKeyPrefixData[] = [
    {
        type: AccessKeyPrefixType.None,
        recommendedPorts: [],
        jsonEncodedValue: "",
        urlEncodedValue: ""
    },
    {
        type: AccessKeyPrefixType.HttpRequest,
        recommendedPorts: [{ number: 80, description: "http" }],
        jsonEncodedValue: "POST ",
        urlEncodedValue: "POST%20"
    },
    {
        type: AccessKeyPrefixType.HttpResponse,
        recommendedPorts: [{ number: 80, description: "http" }],
        jsonEncodedValue: "HTTP/1.1 ",
        urlEncodedValue: "HTTP%2F1.1%20"
    },
    {
        type: AccessKeyPrefixType.DnsOverTcpRequest,
        recommendedPorts: [{ number: 53, description: "dns" }],
        jsonEncodedValue: "\u0005\u00DC\u005F\u00E0\u0001\u0020",
        urlEncodedValue: "%05%C3%9C_%C3%A0%01%20"
    },
    {
        type: AccessKeyPrefixType.TlsClientHello,
        recommendedPorts: [
            { number: 443, description: "https" },
            { number: 463, description: "smtps" },
            { number: 563, description: "nntps" },
            { number: 636, description: "ldaps" },
            { number: 989, description: "ftps-data" },
            { number: 990, description: "ftps" },
            { number: 993, description: "imaps" },
            { number: 995, description: "pop3s" },
            { number: 5223, description: "Apple APN" },
            { number: 5228, description: "Play Store" },
            { number: 5349, description: "turns" }
        ],
        jsonEncodedValue: "\u0016\u0003\u0001\u0000\u00a8\u0001\u0001",
        urlEncodedValue: "%16%03%01%00%C2%A8%01%01"
    },
    {
        type: AccessKeyPrefixType.TlsServerHello,
        recommendedPorts: [
            { number: 443, description: "https" },
            { number: 463, description: "smtps" },
            { number: 563, description: "nntps" },
            { number: 636, description: "ldaps" },
            { number: 989, description: "ftps-data" },
            { number: 990, description: "ftps" },
            { number: 993, description: "imaps" },
            { number: 995, description: "pop3s" },
            { number: 5223, description: "Apple APN" },
            { number: 5228, description: "Play Store" },
            { number: 5349, description: "turns" }
        ],
        jsonEncodedValue: "\u0016\u0003\u0003\u0040\u0000\u0002",
        urlEncodedValue: "%16%03%03%40%00%02"
    },
    {
        type: AccessKeyPrefixType.TlsApplicationData,
        recommendedPorts: [
            { number: 443, description: "https" },
            { number: 463, description: "smtps" },
            { number: 563, description: "nntps" },
            { number: 636, description: "ldaps" },
            { number: 989, description: "ftps-data" },
            { number: 990, description: "ftps" },
            { number: 993, description: "imaps" },
            { number: 995, description: "pop3s" },
            { number: 5223, description: "Apple APN" },
            { number: 5228, description: "Play Store" },
            { number: 5349, description: "turns" }
        ],
        jsonEncodedValue: "\u0013\u0003\u0003\u003F",
        urlEncodedValue: "%13%03%03%3F"
    },
    {
        type: AccessKeyPrefixType.Ssh,
        recommendedPorts: [
            { number: 22, description: "ssh" },
            { number: 830, description: "netconf-ssh" },
            { number: 4334, description: "netconf-ch-ssh" },
            { number: 5162, description: "snmpssh-trap" }
        ],
        jsonEncodedValue: "SSH-2.0\r\n",
        urlEncodedValue: "SSH-2.0%0D%0A"
    }
];
