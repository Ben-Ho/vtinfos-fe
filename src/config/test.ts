import { IConfig } from "app/config/index";
import production from "app/config/production";

const config: IConfig = {
    ...production,
    apiUrl: "http://test-v2.vtinfos.com",
    userProviderUrl: "http://test-v2.vtinfos.com",
    userProviderClientId: "vtinfos_test",
};

export default config;
