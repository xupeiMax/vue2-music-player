import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import MusicList from '@/components/MusicList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player
    },
    {
      path: '/musiclist',
      name: 'MusicList',
      component: MusicList
    }
  ]
})
