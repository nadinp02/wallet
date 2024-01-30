<template>
    <form>
        <div class="container">
        <p>Welcome!</p>
            <input type="text" id="form2Example1" class="form-control" v-model="username" placeholder="Username..."/>
            <input type="password" id="form2Example2" class="form-control" v-model="password" placeholder="Password..."/>

            <button v-show=" username == storedUsername && password == storedPassword" type="button"
            class="btn btn-primary btn-block mb-4" @click="login">Log in</button>
            <div>
            <p>Don't have an account?<router-link to="/register">Sing up</router-link></p>
            </div>
        </div>
    </form>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import router from "@/router";
export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const store = useStore();
    const storedUsername = store.state.id;
    const storedPassword = store.state.password;

    const login = () => {
      console.log('Password ingresada:', password.value);
      console.log('Password almacenada:', storedPassword);
      if (password.value != storedPassword || username.value !=  storedUsername) {
        console.log("los datos son incorrectos");
      } else {
        router.push("/home");
      }
    };

    return {
      username,
      password,
      storedUsername,
      storedPassword,
      login,
    };
  },
};
</script>
<style scoped>
  form {
    width: 300px;
    margin: 0 auto;
    padding: 25px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f7f7f7;
    margin-top: 130px
  }

  form label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  form input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  form button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  form button:hover {
  background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
  }
  input{
    margin-bottom:10px;
    margin-top:10px;
  }
</style>