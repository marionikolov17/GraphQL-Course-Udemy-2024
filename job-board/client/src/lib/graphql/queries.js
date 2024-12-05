import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        operation.setContext({
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
    };

    return forward(operation);
})

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
});

export const jobsQuery = gql`
    query ($limit: Int, $offset: Int) {
        jobs(limit: $limit, offset: $offset) {
            id
            date
            title
            company {
                id
                name
            }
        }
    }
`

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        date
        title
        company {
            id
            name
        }
        description
    }
`

export const jobByIdQuery = gql`
        query($id: ID!) {
            job(id: $id) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
query($id: ID!) {
    company(id: $id) {
        id
        name
        description
        jobs {
            id
            title
            date
        }
    }
}
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob (input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;