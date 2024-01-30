<template>
  <router-view></router-view>
  
</template>

<script>
export default {
  name: 'App',

};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170)

}

nav a{
  padding: 10px;
    font-weight: bold;
  color: white !important;
  text-decoration: none
}
nav a:hover{
  color: white;
}

nav a.router-link-exact-active {
  color: #42b983;
}
select{
  height: 26px !important;
  padding-block: 1px;
  padding-inline: 2px;
}
input{
  height: 26px !important;
}

</style>
