import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeSchema, queryType } from "nexus";

const Query = queryType({
    definition: (t) => {
        t.string("greeting", {
            resolve: () => 'Hello world!'
        })
    }
});

const schema = makeSchema({ types: [Query] });

const server = new ApolloServer({ schema });
const info = await startStandaloneServer(server, { listen: { port: 9000 } });
console.log(`Server is running on ${info.url}`);