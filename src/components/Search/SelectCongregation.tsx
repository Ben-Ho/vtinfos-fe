import { ReactSelectAsync } from "@vivid-planet/react-admin-form";
import ApolloClient from "apollo-client";
import { RestLink } from "apollo-link-rest";
import gqlRest from "graphql-tag";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { ApolloConsumer } from "@apollo/react-hooks";

interface ICongregationOption {
    id: number;
    name: string;
}

interface IVariables {
    pathFunction: any;
    name: string;
}
interface IQueryData {
    congregations: {
        data: ICongregationOption[];
    };
}

const congregationsQuery = gqlRest`
    query Congregations($name: string, $pathFunction: any) {
        congregations (
            name: $name
            pathFunction: $pathFunction
        ) @rest(type: "CongregationsPayload", pathBuilder: $pathFunction) {
            data
        }
    }
`;

const createPathFunction = ({ args }: RestLink.PathBuilderProps) => `/api/v1/congregations${args.name ? `?name=${args.name}` : ""}`;

const loadCongregations = async (client: ApolloClient<any>, inputValue: string) => {
    const { data } = await client.query<IQueryData, IVariables>({
        query: congregationsQuery,
        variables: {
            pathFunction: createPathFunction,
            name: inputValue,
        },
    });
    return data.congregations.data.map(congregation => ({
        value: congregation.id,
        label: congregation.name,
    }));
};

interface IProps extends FieldRenderProps<string, HTMLElement> {}

const SelectCongregation: React.FC<IProps> = props => {
    return (
        <ApolloConsumer>
            {client => (
                <ReactSelectAsync
                    loadingMessage={({ inputValue }) => `Suche Versammlungen mit ${inputValue} im Namen...`}
                    noOptionsMessage={() => `Bitte Text eingeben oder ändern.`}
                    loadOptions={loadCongregations.bind(this, client)}
                    isClearable
                    isSearchable
                    pageSize={10}
                    {...props}
                />
            )}
        </ApolloConsumer>
    );
};
export default SelectCongregation;
