<template>
  <div class="login">
    <el-dialog
      v-if="$store.getters.loginBoolean" :close-on-click-modal="false" title="登录/注册"
      :visible="$store.getters.loginBoolean"
      width="30%"
      center
      @close="$store.dispatch('setLoginBoolean')"
    >
        <login-form v-show="loginType" @typeChange="typeChange" />
        <register-form v-show="!loginType" @typeChange="typeChange" />

  </el-dialog>
  </div>
  
</template>

<script>
import LoginForm from './Login';
import RegisterForm from './Register';

export default {
    name: 'Login',
    components: {
      LoginForm,
      RegisterForm
    },
    data() {
      return {
        loginType: true

      };
    },
    methods: {
      typeChange() {
        this.loginType = !this.loginType;
      }
    }
}
</script>

<style>

</style>