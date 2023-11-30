import gql from "graphql-tag";

export const repositoryType = gql(
    `
    type Owner {
     login: String!
     avatar_url: String!    
    }
    
    type Query {
    listRepositories: [RepositoryType]
    getRepositoryDetails(token: String!, owner: String!, name: String!): RepositoryType
    }
    
    type RepositoryType {
    name: String!
    size: Int!
    owner: Owner
    }`
)
