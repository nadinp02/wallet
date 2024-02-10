<template>
  <div id="app">
  
      <nav  class="navbar navbar-expand-md mb-4">
       <div class="container-fluid">

        <button type="button" class="navbar-toggler" data-bs-toggle="collapse"
        data-bs-target="#MenuNavegacion">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="MenuNavegacion" class="collapse navbar-collapse" aria-haspopup="true" aria-expanded="false">
          <ul class="navbar-nav ms-3">
           <router-link to="/home"><li class="nav-item"><a class="nav-link"
            href="#">Home</a></li></router-link>
            <router-link to="/trade"><li class="nav-item"><a class="nav-link"
            href="#">Trade</a></li></router-link>
            <router-link to="/history"><li class="nav-item"><a class="nav-link"
            href="#">History</a></li></router-link>
            <router-link to="/current-state"><li class="nav-item"><a class="nav-link"
            href="#">Current State</a></li></router-link>
            <router-link to="/investment"><li class="nav-item"><a class="nav-link"
            href="#">Investment Analysis</a></li></router-link>
          </ul>
        </div>
        <div class="d-flex">
          <div v-if="user">
            <p class="nav-text">Hi, {{ user }}!</p>
          </div>
        </div>
        <router-link to="/">Log Out</router-link>

      </div>
      </nav>

    <router-view />
    
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.id;
    }
  },
};
</script>
<style scoped>
.nav-text{
  font-weight: bold;
  padding: 10px;
    color: white;
    text-decoration: none;
    margin: 0;
}
</style>