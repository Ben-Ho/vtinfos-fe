import * as queryString from "querystring";

export function generateQueryString(queryVariables: { [key: string]: any }): string {
    return queryString.stringify(
        Object.keys(queryVariables)
            .filter((key: string) => {
                if (queryVariables[key] === undefined) return false; // no value
                const valueType = typeof queryVariables[key];
                return valueType === "string" || valueType === "boolean" || valueType === "number"; // only supported types
            })
            // no map needed as types transform well into string
            .reduce((acc: { [key: string]: any }, key: string): { [key: string]: any } => {
                acc[key] = queryVariables[key];
                return acc;
            }, {}),
    );
}

export interface ILanguage {
    code: string;
    name: string;
}
export function getSupportedTalkLanguages(language: string): ILanguage[] {
    return [
        { code: "de", name: "Deutsch" },
        { code: "en", name: "Englisch" },
        { code: "fr", name: "Französisch" },
        { code: "zh", name: "Chinesisch" },
        { code: "fa", name: "Persisch" },
        { code: "gebaerde", name: "Gebärdensprache" },
        { code: "twi", name: "Twi" },
        { code: "ga", name: "Ga" },
        { code: "tr", name: "Türkisch" },
        { code: "sr", name: "Serbisch" },
        { code: "ru", name: "Russisch" },
        { code: "es", name: "Spanisch" },
        { code: "ar", name: "Arabisch" },
        { code: "hu", name: "Ungarisch" },
        { code: "it", name: "Italienisch" },
        { code: "tgl", name: "Tagalog" },
        { code: "hi", name: "Hindi" },
        { code: "en_pidgin", name: "Englisch-Pidgin" },
    ];
}
