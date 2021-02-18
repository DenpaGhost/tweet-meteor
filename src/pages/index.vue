<template>
  <div class="frame" ref="frame">
    <div class="comment"
         style="position: absolute; left: 1920px; top: 200px; transform: translateX(-2500px);">
      テスト
    </div>

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
  async mounted() {
    this.client = new TwitterClient(this.$axios);
    this.query = process.env.TWEET_SEARCH_QUERY;
    this.interval = process.env.TWEET_FETCH_INTERVAL_SECOND;

    // this.tweetFetchRoutine();

    for (let i = 0; i < 10; i++) {
      this.instantiateDOM('テスト');
      this.instantiateDOM('abababababababababababababababababab');
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });
    }
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
    },
    instantiateDOM: function (tweets) {
      const div = document.createElement('div');
      div.innerText = tweets;
      div.classList.add('comment');
      div.style.position = 'absolute';
      div.style.left = '1920px';
      this.frame.appendChild(div);
      const {width, height} = div.getBoundingClientRect();

      div.style.top = `${(300 - height) * Math.random()}px`;

      new Promise((resolve) => setTimeout(() => {
        div.style.transform = `translateX(${-1920 - width}px)`;
        resolve();
      }, 0));

      new Promise(resolve => setTimeout(() => {
        div.remove();
      }, 10000));

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

.comment {
  transform: translateX(0);
  transition-property: transform;
  transition-duration: 10s;
  transition-timing-function: linear;
  white-space: nowrap;
}
</style>