import gql from "graphql-tag";

export const repositoryType = gql(
    `
    type Owner {
     login: String!
     avatar_url: String!    
    }
    
    type Query {
    listRepositories: [RepositoryType]
    getRepositoryDetails(owner: String!, name: String!, ref: String): RepositoryDetails
    }
    
    type RepositoryType {
    name: String!
    size: Int!
    owner: Owner
    }
    
    type RepositoryDetails {
    name: String!
    size: Int!
    owner: Owner
    visibility: String!
    fileCount: Int!
    ymlFileContent: String
    activeWebhooks: [Webhook]
    }

    type Webhook {
    id: ID!
    name: String!
    events: [String]!
    isActive: Boolean!
}
`);
