import {AugmentedRequest, RESTDataSource} from '@apollo/datasource-rest';

interface Webhook {
    id: number;
    name: string;
    events: string[];
    isActive: boolean;
}

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

    async getActiveWebhooks(owner: string, repo: string): Promise<Webhook[]> {
        try {
            const response = await this.get(`repos/${owner}/${repo}/hooks`);
            const activeWebhooks = response.filter((webhook: any) => webhook.active);
            return activeWebhooks.map((webhook: any) => ({
                id: webhook.id,
                name: webhook.name,
                events: webhook.events,
                isActive: webhook.active,
            }));
        } catch (error: any) {
            console.error('Error fetching active webhooks:', error.message);
            throw error;
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

    public async listRepositories() {
        return await this.get('user/repos');
    }

    public async getRepositoryDetails(owner: string, name: string, ref?: string) {

        const response = await this.get(`repos/${owner}/${name}`);
        const files = await this.listFilesRecursive(owner, name, ref);
        const ymlFile = files.find((file: any) => file.toLowerCase().endsWith('.yml'));

        return {
            ...response,
            fileCount: files.length,
            ymlFileContent: ymlFile ? await this.getFile(owner, name, ymlFile) : '',
            activeWebhooks: await this.getActiveWebhooks(owner, name)
        };
    }
}
