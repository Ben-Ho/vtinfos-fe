import { useQuery } from "@apollo/react-hooks";
import { Button, Grid, Typography } from "@material-ui/core";
import { SortDirection, TableFilterFinalForm, useTableQueryFilter, useTableQuerySort } from "@vivid-planet/react-admin-core";
import { Field, FieldContainer, ReactSelect } from "@vivid-planet/react-admin-form";
import { RestLink } from "apollo-link-rest";
import * as CommonFormFields from "app/components/common/FormFields";
import SelectCircleGroupOrCircle from "app/components/Search/SelectCircleGroupOrCircle";
import SelectCongregation from "app/components/Search/SelectCongregation";
import Speaker from "app/components/Search/Speaker";
import { generateQueryString, getSupportedTalkLanguages, ILanguage } from "app/utils";
import gqlRest from "graphql-tag";
import * as React from "react";
import * as sc from "./Search.sc";

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
        $start: Int
        $limit: Int
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
            start: $start
            limit: $limit
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
    const { sort, order, start, limit, ...rawFilterVars } = args;
    if (Object.values(rawFilterVars).filter(value => value !== undefined).length === 0) {
        return `/api/v1/speakers?limit=1&familyname=showNobody`;
    }

    const { talkLanguage, ...untransformedFilterVars } = rawFilterVars;
    const filterValues = {
        talkLanguage: talkLanguage ? talkLanguage.code : undefined,
        ...untransformedFilterVars,
    };
    return `/api/v1/speakers?sort=${sort}&sortOrder=${order.toUpperCase()}&start=${start}&limit=${limit}&` + generateQueryString(filterValues);
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
interface IQueryVariables extends IFilterVariables {
    pathFunction: any;
    sort: string;
    order: "DESC" | "ASC";
    start: number;
    limit: number;
}

interface IFilterVariables {
    givenname?: string;
}

export default () => {
    const sortApi = useTableQuerySort({
        columnName: "familyname",
        direction: SortDirection.ASC,
    });
    const filterApi = useTableQueryFilter<IFilterVariables>({});
    const { loading, data, fetchMore } = useQuery<IQueryData, IQueryVariables>(query, {
        variables: {
            pathFunction: createSpeakersPathFunction,
            sort: sortApi.current.columnName,
            order: sortApi.current.direction === SortDirection.DESC ? "DESC" : "ASC",
            start: 0,
            limit: 25,
            ...filterApi.current,
        },
    });

    // TODO umbauen von result-table auf custom kasterl-lösung (ähnlich wie früher) weil table ist mobil ein blödsinn.
    //   -> ergänzen von found-talk-highlighting
    //   -> ergänzen von ausgabe aller vorträge die der redner hat.
    //   -> kopieren von inhalt überprüfen
    // TODO sortieren nach lastname, distanz ermöglichen
    // TODO überlegen ob react-admin-library dann überhaupt noch sinn macht...
    // TODO mehr-laden button fertig implementieren
    // TODO sortierung über select mit spalten nach denen sortiert werden kann.
    // TODO anpassen von abständen bei filter-form. mobil sollten 5-10px reichen
    // TODO mobil gehen bei filter-form die felder nicht bis zum rand raus. (problem scheint auf html-tag ebene zu liegen)
    // TODO bread-crumb weg, macht keinen sinn....
    // TODO info punkt bei filter-feldern um diese zu beschreiben. zb. zwischen den jeweiligen versammlungen, vortrag-nummer: mehrere vorträge durch ; getrennt
    // TODO überlegen wie ich die suche gerne für redner-einladen verwenden würde
    // TODO limit parameter abhängig von media-query
    return (
        <sc.SearchWrapper>
            <TableFilterFinalForm filterApi={filterApi}>
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
            <Grid container spacing={2}>
                {data &&
                    data.speakers &&
                    Object.keys(filterApi.current).length > 0 &&
                    data.speakers.data.map(speaker => (
                        <Grid key={speaker.id} item xs={12} sm={6} md={4} lg={3}>
                            <Speaker key={speaker.id} speaker={speaker} />
                        </Grid>
                    ))}
            </Grid>
            {data && data.speakers.total > data.speakers.data.length && (
                <Grid container justify="center" spacing={3}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                fetchMore({
                                    variables: {
                                        start: data.speakers.data.length,
                                    },
                                    updateQuery: (prev, { fetchMoreResult }) => {
                                        if (!fetchMoreResult) return prev;
                                        return {
                                            speakers: {
                                                __typename: "SpeakersPayload",
                                                data: [...prev.speakers.data, ...fetchMoreResult.speakers.data],
                                                total: prev.speakers.total,
                                            },
                                        };
                                    },
                                });
                            }}
                        >
                            Mehr anzeigen
                        </Button>
                    </Grid>
                </Grid>
            )}
        </sc.SearchWrapper>
    );
};
