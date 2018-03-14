<template>
  <ul>
    <li v-for="(item, index) in musiclist" :key="index">
      <music-list-item v-bind="{musicitem: item,  currentmusicitem: currentmusicitem}"></music-list-item>
    </li>
  </ul>
</template>

<script>
import MusicListItem from './musiclistitem'
export default {
  name: 'MusicList',
  data () {
    return {
    }
  },
  components: { MusicListItem },
  props: ['musiclist', 'currentmusicitem'],
  methods: {
    dayin: function () {
      console.log(this.currentmusicitem)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  margin:0;
  padding:0;
}
li {
  list-style: none;
}
</style>
