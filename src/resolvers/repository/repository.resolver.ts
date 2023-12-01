import {GitHubAPI} from "../../dataSources/repository/github.datasource";
import {Context} from "../../common/interfaces/context.interface";

const repositoryResolver = {
    Query: {
        listRepositories: async (parent: any, args: any, contextValue: Context, info: any) => {
            console.log(contextValue);
            return await contextValue.dataSources.githubAPI.listRepositories();
        },
        getRepositoryDetails: async (_: any, { owner, name, ref }: Record<string, string>, contextValue  : Context, info: any) => {
            return await contextValue.dataSources.githubAPI.getRepositoryDetails(owner, name, ref);
        },
    },
};

export { repositoryResolver };
