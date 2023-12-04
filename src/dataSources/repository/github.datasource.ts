import {AugmentedRequest, RESTDataSource} from '@apollo/datasource-rest';
import {IRepository, IRepositoryDetails, IWebhook} from "./interfaces/repository.interface";
import {GraphQLError} from 'graphql';

export class GitHubAPI extends RESTDataSource {
    private token: string;

    constructor(options: { token: string; }) {
        super();
        this.baseURL = 'https://api.github.com/';
        this.token = options.token;
    }

    override willSendRequest(_path: string, request: AugmentedRequest) {
        request.headers['authorization'] = `Bearer ${this.token}`;
    }

    private async getActiveWebhooks(owner: string, repo: string): Promise<IWebhook[]> {
        try {
            const response = await this.get(`repos/${owner}/${repo}/hooks`);
            const activeWebhooks = response.filter((webhook: any) => webhook.active);
            return activeWebhooks.map((webhook: IWebhook) => ({
                id: webhook.id,
                name: webhook.name,
                events: webhook.events,
                active: webhook.active,
            }));
        } catch (error: any) {
            console.error('Error fetching active webhooks:', error.message);
            throw new GraphQLError('There is problem with finding webhooks', {
                extensions: {code: '500'},
            });
        }
    }

    private async getFile(owner: string, name: string, filePath: string): Promise<string> {
        const response = await this.get(`repos/${owner}/${name}/contents/${filePath}`);
        const buff = Buffer.from(response.content, 'base64').toString('utf8');
        return JSON.stringify(buff);
    }

    private async listFilesRecursive(owner: string, repo: string, ref: string = 'master'): Promise<string[]> {
        const response = await this.get(`repos/${owner}/${repo}/git/trees/${ref}?recursive=1`);
        return response.tree
            .filter((item: any) => item.type === 'blob')
            .map((item: any) => item.path);
    }

    public async listRepositories(): Promise<IRepository[]> {
        try {
            return await this.get('user/repos');
        } catch (error: any) {
            console.error(error);
            throw new GraphQLError('Repositories have been not found', {
                extensions: {code: '404'},
            });
        }
    }

    public async getRepositoryDetails(owner: string, name: string, ref?: string): Promise<IRepositoryDetails> {
        try {

            const response: IRepositoryDetails = await this.get(`repos/${owner}/${name}`);
            const files = await this.listFilesRecursive(owner, name, ref);
            const ymlFile = files.find((file: any) => file.toLowerCase().endsWith('.yml'));

            return {
                ...response,
                fileCount: files.length,
                ymlFileContent: ymlFile ? await this.getFile(owner, name, ymlFile) : '',
                activeWebhooks: await this.getActiveWebhooks(owner, name) ?? []
            };
        } catch (err) {
            throw new GraphQLError(`Repo ${name} for user ${owner} not found.`, {
                extensions: {code: '404'},
            });
        }
    }
}
