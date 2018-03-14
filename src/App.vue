<template>
  <div id="app">
    <div class="component-header row">
      <img src="./assets/music.png" width="40" height="40" alt="" class="-col-auto" />
      <h1 class="caption" v-text="title + ' Music Player'"></h1>
    </div>
    <router-view v-bind="{ musiclist: musiclist,currentmusicitem: currentmusicitem }"></router-view>
  </div>
</template>

<script>
import { MUSIC_LIST } from '../static/musiclist.js'
import $ from 'jquery'
import jplayer from 'jplayer'
import Pubsub from 'pubsub-js'
let repeatstyle = 'cycle'
export default {
  name: 'App',
  data () {
    return {
      title: 'Vue',
      musiclist: MUSIC_LIST,
      currentmusicitem: MUSIC_LIST[0]
    }
  },
  mounted: function () {
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    })

    this.playMusic(this.currentmusicitem)

    $('#player').bind($.jPlayer.event.ended, (e) => {
      switch (repeatstyle) {
        case 'cycle':
          this.autoPlayNext('cycle')
          break
        case 'once':
          this.autoPlayNext('once')
          break
        case 'random':
          this.autoPlayNext('random')
          break
      }
    })

    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext()
    })

    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev')
    })

    Pubsub.subscribe('PLAY_REPEAT', (msg, repeat) => {
      repeatstyle = repeat
    })

    Pubsub.subscribe('DELETE_MUSIC', (msg, musicitem) => {
      this.musiclist = this.musiclist.filter(item => {
        return item !== musicitem
      })
    })

    Pubsub.subscribe('PLAY_MUSIC', (msg, musicitem) => {
      this.playMusic(musicitem)
    })
  },
  destroyed: function () {
    $('#player').unbind($.jPlayer.event.ended)
    Pubsub.unsubscribe('DELETE_MUSIC')
    Pubsub.unsubscribe('PLAY_MUSIC')
    Pubsub.unsubscribe('PLAY_PREV')
    Pubsub.unsubscribe('PLAY_NEXT')
    Pubsub.unsubscribe('PLAY_REPEAT')
  },
  watch: {
    currentmusicitem: {
      handler: function (val) {
        this.currentmusicitem = val
      },
      deep: true
    }
  },
  methods: {
    playMusic: function (musicitem) {
      $('#player').jPlayer('setMedia', {
        mp3: musicitem.file
      }).jPlayer('play')
      this.currentmusicitem = musicitem
    },
    playNext: function (type = 'next') {
      let index = this.getMusicIndex(this.currentmusicitem)
      let newIndex = null
      let musicListLength = this.musiclist.length
      if (type === 'prev') {
        newIndex = (index - 1 + musicListLength) % musicListLength
        this.currentmusicitem = this.musiclist[newIndex]
        this.playMusic(this.musiclist[newIndex])
      } else {
        if (repeatstyle === 'once') {
          newIndex = (index + 1) % musicListLength
          this.currentmusicitem = this.musiclist[newIndex]
          this.playMusic(this.musiclist[newIndex])
        } else {
          this.autoPlayNext(repeatstyle)
        }
      }
    },
    autoPlayNext: function (model) {
      let index = this.getMusicIndex(this.currentmusicitem)
      let newIndex = null
      let musicListLength = this.musiclist.length
      switch (model) {
        case 'once':
          newIndex = index
          break
        case 'random':
          do {
            newIndex = Math.floor(Math.random() * musicListLength)
          } while (newIndex === index)
          break
        default:
          newIndex = (index + 1) % musicListLength
          break
      }

      this.playMusic(this.musiclist[newIndex])
      this.currentmusicitem = this.musiclist[newIndex]
    },
    getMusicIndex: function (musicitem) {
      return this.musiclist.indexOf(musicitem)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.component-header {
  box-sizing: border-box;
  padding: 15px 25px;
  border-bottom: 1px solid #ccc;
  background: #fff;
}
.component-header .caption {
  font-size: 20px;
  text-indent: 20px;
  color: #666;
}
</style>
