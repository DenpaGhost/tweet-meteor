<template>
  <div class="frame">

  </div>
</template>

<script>
import TwitterClient from "../models/TwitterClient";
import SearchDate from "../models/SearchDate";

export default {
  name: "index",
  mounted() {
    this.client = new TwitterClient(this.$axios);
    this.query = process.env.TWEET_SEARCH_QUERY;
    this.interval = process.env.TWEET_FETCH_INTERVAL_SECOND;

    this.tweetFetchRoutine();
  },
  data: function () {
    return {
      lastFetching: null,
      client: null,
      query: '',
      interval: 60
    }
  },
  methods: {
    tweetFetchRoutine: async function () {
      while (true) {
        await new Promise(async (resolve) => {
          const since = this.lastFetching;

          const response = await this.client.search(
              this.query,
              since?.toISOString());

          const tweets = [...response.data];

          if (response.meta.next_token && this.lastFetching) {
            tweets.push(...(await this.fetchNextTweet(response.meta.next_token, since)));
          }
          this.lastFetching = SearchDate.now.date;

          console.log(tweets);

          setTimeout(() => resolve(), this.interval * 1000);
        });
      }
    },
    fetchNextTweet: async function (nextToken, since) {
      const response = await this.client.search(this.query, since, nextToken);
      const tweets = [...response.data];

      if (response.meta?.next_token) {
        tweets.push(...(await this.fetchNextTweet(response.meta.next_token, since)));
      }

      return tweets;
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.frame {
  height: 100vh;
  width: 100vw;
  position: relative;
}
</style>