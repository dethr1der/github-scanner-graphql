import {GitHubAPI} from "../../dataSources/repository/github.datasource";

export interface Context {
    dataSources: {
        githubAPI: GitHubAPI;
    };
}
