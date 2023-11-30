import {AugmentedRequest, RESTDataSource} from '@apollo/datasource-rest';

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
   public async listRepositories() {
        const response = await this.get('user/repos');
        return response;
    }

    public async getRepositoryDetails(token: string, owner: string, name: string) {

    }
}
