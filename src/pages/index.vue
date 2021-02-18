<template>
  <div class="frame" ref="frame">
    <div class="notify" :class="{error: isError, green: !isError}">
      {{ errorStatus ? errorStatus : '-' }} - {{ lastFetching ? lastFetching.toLocaleString() : '-' }}
    </div>
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

    // this.tweetFetchRoutine();
  },
  data: function () {
    return {
      lastFetching: null,
      client: null,
      query: '',
      interval: 60,
      isError: false,
      errorStatus: null
    }
  },
  methods: {
    tweetFetchRoutine: async function () {
      while (true) {
        await new Promise(async (resolve) => {

          try {
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

            this.isError = false;
          } catch (e) {
            this.isError = true;
            this.errorStatus = `${(e?.response?.data?.title) ?? 'unknown'}(${(e?.response?.status) ?? '-'})`;
          }

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
  },
  computed: {
    frame: function () {
      return this.$refs['frame'];
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  overflow: hidden;

  font-size: 24pt;
}

.frame {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
}

.notify {
  position: absolute;
  right: 0;
  bottom: 0;
}

.error {
  color: red;
  font-weight: bold;
}

.green {
  display: none;
}
</style>