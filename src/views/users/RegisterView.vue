<template>
    <form>
        <div class="container">
        <p>If you are new you will receive <b>$100,000!</b></p>
        <input type="text" id="form2Example1" class="form-control" v-model="email" placeholder="Email..."/>
        <input type="email" id="form2Example2" class="form-control" v-model="username" placeholder="Username..."/>
        <input type="password" id="form2Example3" class="form-control" v-model="confirmedPassword"  placeholder="Password..." />
        <input type="password" id="form2Example3" class="form-control" v-model="password" placeholder="Repeat password..."/>
         <div class="alert alert-danger fade show" role="alert" v-if="confirmedPassword != password" >
            <strong>Password don't match</strong> 
          </div>
          <div class="mb-3 mt-3" v-else>
            <button type="button" class="btn" @click="register">Sing up</button>
          </div >
        <p>Have an account?<router-link to=/>Log in</router-link></p>
            
        </div>
    </form>
</template>


<script>

import { useStore } from 'vuex';
import {ref} from 'vue'
import router from '@/router';

export default{
  setup(){
      const store = useStore();
      let availableFunds = ref(100000);
      const email = ref('');
      const username = ref('');
      const password = ref('');
      const confirmedPassword = ref('');
      let btcamount = ref(0);
      let ethamount = ref(0);
      let usdcamount = ref(0);
      const isRegistered = ref(false);

      const register = () => {
        if(email.value == '' || username.value == '' || password.value == '' || confirmedPassword.value == '' ){
          console.log('no pueden quedar datos vacios')
        }else{
          if(password.value != confirmedPassword.value){
            console.log('las contraseñas no coinciden')

          }else{
            store.commit('setId',username.value);
            store.commit('setPassword',password.value)
            store.commit('setAvailableFunds',availableFunds.value)
            store.commit('setBTC',btcamount.value)
            store.commit('setETH',ethamount.value)
            store.commit('setUSDC',usdcamount.value)
            console.log('Logged in:', store.state.id);
            router.push('/home')
            isRegistered.value = true;
          }
        }
      }
      return{
          email,
          username,
          password,
          confirmedPassword,
          isRegistered,
          register
      }   
  }
}
</script>

<style scoped>
  form {
    width: 400px;
    margin: 0 auto;
    padding: 50px;
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