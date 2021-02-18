export default class TwitterClient {
    constructor(axios) {
        this.axios = axios.create({baseURL: '/twitter-api-v2'});
        this.userMap = new Map();
    }

    async search(query, since, nextToken = null) {
        const params = {
            query: query,
            expansions: 'author_id',
            'includes.users': [],
            'max_results': process.env.TWEET_SEARCH_MAX_RESULTS
        };

        if (nextToken !== null) {
            params.next_token = nextToken;
        }

        if (since !== null) {
            params.start_time = since;
        }

        const {data} = await this.axios.get('/tweets/search/recent', {params});

        if (data.meta.result_count > 0) {
            data.includes.users.forEach(user => {
                this.userMap.set(user.id, user);
            });
        }

        return data;
    }

    /**
     *
     * @param id
     * @returns {{id: string, name: string, username: string}}
     */
    getUser(id) {
        return this.userMap.get(id);
    }
}