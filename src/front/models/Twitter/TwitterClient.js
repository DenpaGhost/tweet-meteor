import Axios from 'axios';

export default class TwitterClient {
    constructor() {
        this.client = Axios.create({headers: {'Authorization': `Bearer ${process.env.BEARER_TOKEN}`}});
    }

    search() {
        return this.client.get('https://api.twitter.com/2/tweets/search/recent', {
            query: '#タマクラ'
        });
    }
}