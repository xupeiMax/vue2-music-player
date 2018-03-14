<template>
  <div class="component-musiclistitem row" v-bind:class="[{focus:musicitem===currentmusicitem}]" @click="play(musicitem)">
    <p><strong v-text="musicitem.title"></strong> - {{musicitem.artist}}</p>
    <p class="-col-auto delete" @click.stop="deleteMusic(musicitem)"></p>
  </div>
</template>

<script>
import Pubsub from 'pubsub-js'
export default {
  name: 'MusicListItem',
  data () {
    return {
    }
  },
  props: ['musicitem', 'currentmusicitem'],
  methods: {
    play: function (musicitem) {
      Pubsub.publish('PLAY_MUSIC', musicitem)
    },
    deleteMusic: function (musicitem) {
      Pubsub.publish('DELETE_MUSIC', musicitem)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.component-musiclistitem {
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #ddd;
  text-indent: 10px;
  cursor: pointer;
}

.component-musiclistitem .delete {
  cursor: pointer;
  height: 30px;
  width: 30px;
  top: 3px;
  position: relative;
  transform: rotate(45deg);
  margin-right: 15px;
}

.component-musiclistitem .delete::before,
.delete::after {
  content: '';
  display: block;
  background: #666;
  position: absolute;
}

.component-musiclistitem .delete::before {
  width: 100%;
  height: 1px;
  top: 14px;
  left: 0;
}

.component-musiclistitem .delete::after {
  width: 100%;
  height: 1px;
  top: 15px;
  left: 0;
  transform: rotate(90deg);
}

.component-musiclistitem.focus {
  color: #2f9842;
}

.component-musiclistitem:hover {
  background: #eee;
}
</style>
