import { ReactSelectAsync } from "@vivid-planet/react-admin-form";
import ApolloClient from "apollo-client";
import { RestLink } from "apollo-link-rest";
import gqlRest from "graphql-tag";
import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { FieldRenderProps } from "react-final-form";

interface IOption {
    value: string;
    label: string;
}

interface ICircle {
    id: number;
    name: string;
}

interface ICircleGroup {
    id: number;
    name: string;
    circles: ICircle[];
}

interface IQueryData {
    circleGroups: {
        data: ICircleGroup[];
    };
}

const circleGroupsQuery = gqlRest`
    query CircleGroups($pathFunction: any) {
        circleGroups (
            pathFunction: $pathFunction
        ) @rest(type: "CircleGroupsPayload", path: "/api/v1/circle-groups") {
            data @type(name: "CircleGroup") {
                id
                name
                circles @type(name: "Circle") {
                    id
                    name
                }
            }
        }
    }
`;

const createPathFunction = ({ args }: RestLink.PathBuilderProps) => `/api/v1/circle-groups`;

const loadCircleGroupOrCircleOptions = async (client: ApolloClient<any>, inputValue: string) => {
    const { data } = await client.query<IQueryData>({
        query: circleGroupsQuery,
        variables: {
            pathFunction: createPathFunction,
            name: inputValue,
        },
    });
    const options = data.circleGroups.data.reduce((acc: IOption[], circleGroup) => {
        acc.push({
            value: `g_${circleGroup.id}`,
            label: circleGroup.name,
        });
        const circleOptions = circleGroup.circles
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(circle => ({ value: `c_${circle.id}`, label: `- ${circle.name}` }));
        acc.push(...circleOptions);
        return acc;
    }, []);
    return options;
};

interface IProps extends FieldRenderProps<string, HTMLElement> {}

const SelectCircleGroupOrCircle: React.FC<IProps> = props => {
    return (
        <ApolloConsumer>
            {client => <ReactSelectAsync loadOptions={loadCircleGroupOrCircleOptions.bind(this, client)} defaultOptions {...props} />}
        </ApolloConsumer>
    );
};
export default SelectCircleGroupOrCircle;
