<template>
  <div class="component-progress" @click="progressChange">
    <div class="progress" :style="{ width: `${progress}%`,background: barColor}"></div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  data () {
    return {

    }
  },
  // props: ['progress', 'barColor']
  props: {
    progress: {
      required: true
    },
    barColor: {
      default: '#2f9842'
    }
  },
  methods: {
    progressChange: function (e) {
      this.$emit('progressHandler', (e.clientX - e.target.getBoundingClientRect().left) / e.target.clientWidth)
    }
  }
}
</script>

<style scoped>
.component-progress {
  width: 100%;
  height: 3px;
  background: #ddd;
  cursor: pointer;
}

.component-progress .progress {
  height: 3px;
}
</style>
