import {Button, Grid, Typography} from "@material-ui/core";
import {
    SortDirection,
    Table as AdminTable,
    TableFilterFinalForm,
    TableQuery,
    useTableQuery,
    useTableQuerySort,
} from "@vivid-planet/react-admin-core";
import { Field, FieldContainer, ReactSelect, ReactSelectAsync, ReactSelectStaticOptions } from "@vivid-planet/react-admin-form";
import { RestLink } from "apollo-link-rest";
import * as CommonFormFields from "app/components/common/FormFields";
import SelectCircleGroupOrCircle from "app/components/Search/SelectCircleGroupOrCircle";
import SelectCongregation from "app/components/Search/SelectCongregation";
import { generateQueryString, getSupportedTalkLanguages, ILanguage } from "app/utils";
import gqlRest from "graphql-tag";
import * as React from "react";
import * as sc from "./Search.sc";
import Speaker from "app/components/Search/Speaker";

const query = gqlRest`
    query SearchSpeakers(
        $pathFunction: any
        $language: String
        $talkLanguage: String
        $talk: String
        $givenname: String
        $familyname: String
        $phone: String
        $congregationId: Int
        $circleId: Int
        $groupId: Int
        $maxDistance: Int
        $noBeard: Boolean
        $sort: String
        $order: String
    ) {
        speakers (
            language: $language
            talkLanguage: $talkLanguage
            talk: $talk
            givenname: $givenname
            familyname: $familyname
            phone: $phone
            congregationId: $congregationId
            circleId: $circleId
            groupId: $groupId
            maxDistance: $maxDistance
            noBeard: $noBeard
            sort: $sort
            order: $order
        ) @rest(type: "SpeakersPayload", pathBuilder: $pathFunction) {
            data @type(name: "Speaker") {
                id
                givenname
                familyname
                email
                phone
                phone2
                note
                degree
                circle_name
                congregation_name
                congregation_id
                talks
            }
            total
        }
    }
`;

function createSpeakersPathFunction({ args }: RestLink.PathBuilderProps) {
    const nonFilterParameter = ["sort", "order"];
    return (
        `/api/v1/speakers?sort=${args.sort}&sortOrder=${args.order.toUpperCase()}&` +
        generateQueryString<IQueryVariables>(args as IQueryVariables, nonFilterParameter)
    );
}

export interface ISpeaker {
    id: string;
    givenname: string;
    familyname: string;
    email: string;
    phone: string;
    phone2: string;
    note: string;
    degree: string;
    circle_name: string;
    congregation_name: string;
    congregation_id: string;
    talks: any;
}

interface IQueryData {
    speakers: {
        data: ISpeaker[];
        total: number;
    };
}
interface IQueryVariables {
    pathFunction: any;
    sort: string;
    order: "DESC" | "ASC";
}

export default () => {
    const sortApi = useTableQuerySort({
        columnName: "familyname",
        direction: SortDirection.ASC,
    });
    const { tableData, api, loading, error } = useTableQuery<IQueryData, IQueryVariables>()(query, {
        resolveTableData: ({ speakers }) => ({
            data: speakers.data,
            totalCount: speakers.total,
        }),
        variables: {
            pathFunction: createSpeakersPathFunction,
            sort: sortApi.current.columnName,
            order: sortApi.current.direction === SortDirection.DESC ? "DESC" : "ASC",
        },
    });
    const { pathFunction, sort, order, ...filterValues } = api.getVariables();
    /*
// TODO umbauen von result-table auf custom kasterl-lösung (ähnlich wie früher) weil table ist mobil ein blödsinn.
//   -> ergänzen von found-talk-highlighting
//   -> ergänzen von ausgabe aller vorträge die der redner hat.
//   -> kopieren von inhalt überprüfen
// TODO überlegen ob react-admin-library dann überhaupt noch sinn macht...
// TODO mehr-laden button fertig implementieren
// TODO sortierung über select mit spalten nach denen sortiert werden kann.
// TODO anpassen von abständen bei filter-form. mobil sollten 5-10px reichen
// TODO mobil gehen bei filter-form die felder nicht bis zum rand raus. (problem scheint auf html-tag ebene zu liegen)
// TODO bread-crumb weg, macht keinen sinn....
// TODO info punkt bei filter-feldern um diese zu beschreiben. zb. zwischen den jeweiligen versammlungen, vortrag-nummer: mehrere vorträge durch ; getrennt
// TODO überlegen wie ich die suche gerne für redner-einladen verwenden würde
 */
    return (
        <sc.SearchWrapper>
            <TableQuery api={api} loading={loading} error={error}>
                <TableFilterFinalForm
                    modifySubmitVariables={({ talkLanguage, ...values }) => {
                        return { ...values, talkLanguage: talkLanguage ? talkLanguage.code : undefined };
                    }}
                >
                    <Field name="talk" type="text" label="Vortrag (Nr. oder Titel)" component={CommonFormFields.StyledInput} />
                    <Field
                        name="talkLanguage"
                        type="text"
                        label="Vortragssprache"
                        component={ReactSelect}
                        getOptionLabel={(option: ILanguage) => option.name}
                        getOptionValue={(option: ILanguage) => option.code}
                        isClearable
                        options={getSupportedTalkLanguages("de")}
                    />
                    <Field name="givenname" type="text" label="Vorname" component={CommonFormFields.StyledInput} />
                    <Field name="familyname" type="text" label="Nachname" component={CommonFormFields.StyledInput} />
                    <Field name="email" type="text" label="E-Mail" component={CommonFormFields.StyledInput} />
                    <Field name="phone" type="text" label="Telefonnummer" component={CommonFormFields.StyledInput} />
                    <Field name="congregation" label="Versammlung" component={SelectCongregation} />
                    <Field name="circle" label="Kreis" component={SelectCircleGroupOrCircle} />
                    <Field name="maxDistance" defaultValue={50} type="text" label="Luftlinie (km)" component={CommonFormFields.StyledInput} />
                    <Field name="noBeard" type="checkbox" label="Kein Voll-/Modebart">
                        {({ input, meta }) => (
                            <FieldContainer label="Kein Voll-/Modebart">
                                <input type="checkbox" {...input} />
                                {meta.error && meta.touched && <Typography color="error">{meta.error}</Typography>}
                            </FieldContainer>
                        )}
                    </Field>
                </TableFilterFinalForm>
                {/*sortieren nach lastname, distanz*/}
                <Grid container spacing={2}>
                    { tableData
                        && Object.keys(filterValues).length > 0
                        && tableData.data.map(speaker =>
                            <Grid item xs={12} sm={6} md={4} lg={3}><Speaker key={speaker.id} speaker={speaker} /></Grid>)
                    }
                </Grid>
                { tableData && tableData.totalCount > tableData.data.length
                    && <Grid container justify="center" spacing={3}><Grid item>
                        <Button variant="outlined" onClick={() => {
                            console.log('button click');
                        }}>Mehr anzeigen</Button>
                    </Grid></Grid>
                }
            </TableQuery>
        </sc.SearchWrapper>
    );
};
