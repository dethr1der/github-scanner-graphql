interface IRepoOwner {
    login: string
    avatar_url: string;
}

export interface IRepository {
    name: string;
    size: number;
    owner: IRepoOwner
}

export interface IWebhook {
    id: string
    name: string
    events: [string]
    active: boolean;

}

export interface IRepositoryDetails extends IRepository {
    visibility: string
    fileCount: number;
    ymlFileContent?: string;
    activeWebhooks: IWebhook[];
}
