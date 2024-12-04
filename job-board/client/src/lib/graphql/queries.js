import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    const { jobs } = await client.request(query);
    return jobs;
}

export async function getJob(id) {
    const query = gql`
        query($id: ID!) {
            job(id: $id) {
                id
                date
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;

    const { job } = await client.request(query, { id });
    return job;
}