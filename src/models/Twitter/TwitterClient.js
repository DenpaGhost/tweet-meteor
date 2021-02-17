import Axios from 'axios';

export default class TwitterClient {
    constructor() {
        this.client = Axios.create();
    }
}