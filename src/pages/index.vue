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

    this.visibleAuthor = process.env.VISIBLE_AUTHOR === 'true';

    const now = SearchDate.now.date;
    if (now.getSeconds() - 20 >= 0) {
      now.setSeconds(now.getSeconds() - 20);
    } else if (now.getMinutes() - 1 >= 0) {
      now.setMinutes(now.getMinutes() - 1);
      now.setSeconds(40);
    }
    this.lastFetching = now;

    this.tweetFetchRoutine();
  },
  data: function () {
    return {
      lastFetching: null,
      client: null,
      query: '',
      interval: 60,
      isError: false,
      errorStatus: null,
      visibleAuthor: false
    }
  }
  ,
  methods: {
    tweetFetchRoutine: async function () {
      while (true) {
        await new Promise(async (resolve) => {

          try {
            const since = this.lastFetching;
            const response = await this.client.search(
                `${this.query} -is:retweet`,
                since?.toISOString());

            if (response.meta.result_count > 0) {
              const tweets = [...response.data];

              if (response.meta.next_token && this.lastFetching) {
                tweets.push(...(await this.fetchNextTweet(response.meta.next_token, since)));
              }
              this.lastFetching = SearchDate.now.date;

              this.meteorTweets(tweets);
            }

            this.isError = false;
          } catch (e) {
            console.dir(e);
            this.isError = true;
            this.errorStatus = `${(e?.message) ?? 'unknown'}(${(e?.response?.status) ?? '-'})`;
          }

          setTimeout(() => resolve(), this.interval * 1000);
        });
      }
    }
    ,
    fetchNextTweet: async function (nextToken, since) {
      const response = await this.client.search(`${this.query} -is:retweet`, since, nextToken);
      const tweets = [...response.data];

      if (response.meta?.next_token) {
        tweets.push(...(await this.fetchNextTweet(response.meta.next_token, since)));
      }

      return tweets;
    }
    ,
    meteorTweets: async function (tweets) {
      const meteorInterval = (this.interval * 1000) / tweets.length;

      for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];

        const comment = tweet.text.replace(/\n/g, ' ').replace(new RegExp(`${this.query}`, 'g'), ' ');
        const author = this.client.getUser(tweet.author_id);

        if (this.visibleAuthor) {
          this.instantiateDOM(comment, author.name);
        } else {
          this.instantiateDOM(comment);
        }

        await new Promise(resolve => setTimeout(resolve, meteorInterval));
      }
    }
    ,
    instantiateDOM: function (comment, author = null) {
      const div = document.createElement('div');
      div.classList.add('comment');
      div.style.position = 'absolute';
      div.style.left = '1920px';

      const commentDiv = document.createElement('div');
      commentDiv.innerText = comment;
      div.appendChild(commentDiv);

      if (!!author) {
        const authorDiv = document.createElement('div');
        authorDiv.innerText = author;
        div.appendChild(authorDiv);
      }

      this.frame.appendChild(div);

      const {width, height} = div.getBoundingClientRect();
      div.style.top = `${(1080 - height) * Math.random()}px`;

      new Promise((resolve) => setTimeout(() => {
        div.style.transform = `translateX(${-1920 - width}px)`;
        resolve();
      }, 0));

      new Promise(resolve => setTimeout(() => {
        div.remove();
      }, 10000));
    }
  }
  ,
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

  & > div:nth-child(2) {
    font-size: 18pt;
  }
}
</style>