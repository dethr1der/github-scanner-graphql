import {Context} from "../../common/interfaces/context.interface";
import {IGetRepositoryDetails} from "./arguments/repositoryDetails.interface";

const repositoryResolver = {
    Query: {
        listRepositories: async (parent: any, args: any, contextValue: Context, info: any) => {
            return await contextValue.dataSources.githubAPI.listRepositories();
        },
        getRepositoryDetails: async (_: any, { owner, name, ref }: IGetRepositoryDetails, contextValue  : Context, info: any) => {
           return await contextValue.dataSources.githubAPI.getRepositoryDetails(owner, name, ref);
        },
    },
};

export { repositoryResolver };
