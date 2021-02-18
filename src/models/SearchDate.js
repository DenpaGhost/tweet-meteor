export default class SearchDate {
    constructor() {
        this.date = new Date();
    }

    get ISO() {
        return this.date.toISOString();
    }

    static get now() {
        return new SearchDate();
    }
}