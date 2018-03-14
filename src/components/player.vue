<template>
  <div class="player-page">
  <h1 class="caption">
    <a><router-link to="/musiclist">我的私人音乐坊 &gt;</router-link></a>
  </h1>
  <div class="mt20 row">
    <div class="controll-wrapper" >
      <h2 class="music-title">{{currentmusicitem.title}}</h2>
      <h3 class="music-artist">{{currentmusicitem.artist}}</h3>
      <div class="row mt20">
        <div class="left-time -col-auto">-{{leftTime}}</div>
        <div class="volume-container">
          <i class="icon-volume rt" style="top: 5px;left: -5px"></i>
          <div class="volume-wrapper">
            <Progress v-bind="{progress:volume,barColor:'#aaa'}" @progressHandler="volumeHandler"></Progress>
          </div>
        </div>
      </div>
      <div style="height: 10px;line-height: 10px;margin-top: 10px">
        <Progress v-bind="{progress:progress}" @progressHandler="progressHandler"></Progress>
      </div>
      <div class="mt35 row">
        <div>
          <i class="icon prev" @click.stop="prevPlay"></i>
          <i class="icon ml20" :class="[{pause:isPlay, play:!isPlay}]" @click.stop="playOrPause"></i>
          <i class="icon next ml20" @click.stop="nextPlay"></i>
        </div>
        <div class="-col-auto">
          <i class="icon" :class="'repeat-'+ repeat" @click.stop="repeatChange"></i>
        </div>
      </div>
    </div>
    <div class="-col-auto cover">
      <img class="music-pic" :src="currentmusicitem.cover" alt="歌曲名称" />
    </div>
  </div>
</div>
</template>

<script>
import Progress from './progress'
import $ from 'jquery'
import jplayer from 'jplayer'
import Pubsub from 'pubsub-js'
let duration = null
let isplay = false
let repeats = ['cycle', 'once', 'random']
export default {
  name: 'Player',
  data () {
    return {
      isPlay: isplay,
      repeat: repeats[0],
      progress: 0,
      volume: 80,
      leftTime: null
    }
  },
  components: { Progress },
  props: ['musicitem', 'currentmusicitem'],
  mounted: function () {
    $('#player').bind($.jPlayer.event.play, (e) => {
      // 拿到当前播放状态
      if (!e.jPlayer.status.paused) {
        isplay = true
        this.isPlay = isplay
      }
    })
    $('#player').bind($.jPlayer.event.timeupdate, (e) => {
      duration = Math.round(e.jPlayer.status.duration)
      this.progress = Math.round(e.jPlayer.status.currentPercentAbsolute)
      this.volume = Math.round(e.jPlayer.options.volume * 100)
      this.leftTime = this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
    })
  },
  destroyed: function () {
    $('#player').unbind($.jPlayer.event.timeupdate)
  },
  watch: {
    currentmusicitem: {
      handler: function (val, oldVal) {
        this.isPlay = true
      },
      deep: true
    }
  },
  methods: {
    playOrPause: function (e) {
      e.stopPropagation()
      if (isplay) {
        $('#player').jPlayer('pause')
      } else {
        $('#player').jPlayer('play')
      }
      isplay = !isplay
      this.isPlay = isplay
    },
    progressHandler: function (progress) {
      if (this.isPlay) {
        $('#player').jPlayer('play', duration * progress)
      } else {
        $('#player').jPlayer('pause', duration * progress)
      }
      this.progress = Math.floor(progress * 100)
    },
    volumeHandler: function (progress) {
      $('#player').jPlayer('volume', progress)
      this.volume = progress * 100
    },
    nextPlay: function () {
      if (!isplay) {
        isplay = true
        this.isPlay = isplay
      }
      Pubsub.publish('PLAY_NEXT')
    },
    prevPlay: function () {
      if (!isplay) {
        isplay = true
        this.isPlay = isplay
      }
      Pubsub.publish('PLAY_PREV')
    },
    repeatChange: function () {
      repeats.push(repeats.shift())
      this.repeat = repeats[0]
      Pubsub.publish('PLAY_REPEAT', this.repeat)
    },
    formatTime: function (time) {
      let minutes = Math.floor(time / 60)
      let seconds = Math.floor(time % 60)
      seconds = seconds < 10 ? `0${seconds}` : seconds
      return `${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #2f9842;
}
.player-page {
  width: 700px;
  margin: auto;
  margin-top: 120px;
}

.player-page .caption {
  font-size: 16px;
  color: rgb(47, 152, 66);
  cursor: pointer;
}

.player-page .cover {
  width: 180px;
  height: 180px;
  margin-left: 20px;
}

.player-page .cover img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

.volume-container {
  position: relative;
  left: 20px;
  top: -3px;
}

.volume-container .volume-wrapper {
  opacity: 0;
  transition: opacity .5s linear;
}

.volume-container:hover .volume-wrapper {
  opacity: 1;
}

.music-title {
  font-size: 25px;
  font-weight: 400;
  color: rgb(3, 3, 3);
  height: 36px;
  line-height: 36px;
}

.music-artist {
  font-size: 15px;
  font-weight: 400;
  color: rgb(74, 74, 74);
}

.left-time {
  font-size: 14px;
  color: #999;
  font-weight: 400;
  width: 40px;
}

.icon {
  cursor: pointer;
}

.ml20 {
  margin-left: 20px;
}

.mt35 {
  margin-top: 35px;
}

.volume-wrapper {
  width: 60px;
  display: inline-block;
}

</style>
