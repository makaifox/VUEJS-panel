<template>
  <v-app>
    <default-bar />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  
</script>
<style>
.container{
     max-width: 100vw;
     padding:0px !important;
  }
</style>