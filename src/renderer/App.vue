<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';
</style>
