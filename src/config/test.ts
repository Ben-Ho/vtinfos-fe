import { IConfig } from "app/config/index";
import production from "app/config/production";

const config: IConfig = {
    ...production,
    apiUrl: "http://test6.renner-stauden.at",
    userProviderUrl: "http://test6.renner-stauden.at",
    userProviderClientId: "vtinfos_local",
};

export default config;
