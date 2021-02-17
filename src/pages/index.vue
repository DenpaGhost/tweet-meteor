<template>
  <div class="container">
    <div class="tweet">テスト</div>
  </div>
</template>

<script>
import TwitterClient from "~/models/Twitter/TwitterClient";

export default {
  name: "index",
  mounted() {
    const client = new TwitterClient();
    client.client.get('search/tweets', {q: '#タマクラ'}, function (error, tweets, response) {
      console.log(tweets);
    });
  }
}
</script>

<style lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

@keyframes meteor {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100vw);
  }
}

.tweet {
  position: absolute;
  left: 100vw;
  top: 300px;
  white-space: nowrap;

  animation: meteor 5s linear;
}
</style>