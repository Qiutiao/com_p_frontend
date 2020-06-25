<template>
  <el-dialog
      v-if="$store.getters.loginBoolean" :close-on-click-modal="false" title="Login"
      :visible="$store.getters.loginBoolean"
      width="30%"
      center
      @close="$store.dispatch('setLoginBoolean')"
    >
      <login-form v-show="loginType" @typeChange="typeChange" />
      <register-form v-show="!loginType" @typeChange="typeChange" />

 </el-dialog>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style>

</style>