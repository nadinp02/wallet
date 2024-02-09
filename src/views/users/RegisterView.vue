<template>
  <form>
    <div class="container">
      <p>If you are new, you will receive <b>$100,000!</b></p>

      <input type="text" id="registerEmail" class="form-control" v-model="email" placeholder="Email..." />
      <input type="email" id="registerUser" class="form-control" v-model="username" placeholder="Username..." />
      <input type="password" id="registerPassword" class="form-control" v-model="confirmedPassword" placeholder="Password..." />
      <input type="password" id="registerPassword2" class="form-control" v-model="password" placeholder="Repeat password..." />

      <div class="alert alert-danger fade show" role="alert" v-if="confirmedPassword !== password">
        <strong>Passwords don't match</strong>
      </div>

      <div class="alert alert-danger fade show" role="alert" v-else-if="password.length > 0 && password.length < 8">
        <strong>Password must be at least 8 characters</strong>
      </div>

      <div class="mb-3 mt-3" v-else>
        <button type="button" class="btn" @click="register">Sign up</button>
      </div>

      <p>Have an account? <router-link to="/">Log in</router-link></p>
    </div>
  </form>
</template>



<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import router from '@/router';

export default {
  setup() {
    const store = useStore();
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const confirmedPassword = ref('');
    let availableFunds = ref(100000);

   const register = () => {
      if (email.value === '' || username.value === '' || password.value === '' || confirmedPassword.value === '') {
        console.log('No pueden quedar datos vacíos');
      } else {
        if (password.value !== confirmedPassword.value) {
          console.log('Las contraseñas no coinciden');
        } else if (password.value.length < 8) {
          console.log('La contraseña debe tener al menos 8 caracteres');
        } else {
          store.commit('setId', username.value);
          store.commit('setPassword', password.value);
          store.commit('setAvailableFunds', availableFunds.value);
          store.commit('setBTC', 0);
          store.commit('setETH', 0);
          store.commit('setUSDC', 0);

          console.log('Logged in:', store.state.id);
          router.push('/home');
        }
      }
    };

    return {
      email,
      username,
      password,
      confirmedPassword,
      register,
    };
  },
};
</script>


<style scoped>
  form {
    width: 400px;
    margin: 0 auto;
    padding: 50px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 130px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background: linear-gradient(90deg, #ffffff, #f8f8f8);

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