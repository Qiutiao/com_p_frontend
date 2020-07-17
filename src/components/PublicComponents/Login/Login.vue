<template>
  <div class="Login">
    <el-form ref="loginForm" :model="loginForm" status-icon :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" :maxlength="20" show-password type="password" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="验证码" prop="verifyCode">
        <el-row type="flex" justify="space-between" :gutter="16">
          <el-col :span="10"> <el-input v-model="loginForm.verifyCode" :maxlength="4" /></el-col>
          <el-col :span="10" style="height:40px;">
            <img
              style="height:100%;width:100%"
              :src="`data:image/bmp;base64,${imageBase64}`"
              @click.stop="getCode"
            >
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="$emit('typeChange','')">注册</el-button>
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        <!-- <el-button @click="loginQQ"><svg font-size="14" class="icon" aria-hidden="true">
          <use xlink:href="#picQQ" />
        </svg>QQ登录</el-button> -->
      </el-form-item>
    </el-form>
    <!-- <el-dialog
      title="QQ登入"
      :visible.sync="qqDialogVisible"
      :append-to-body="true"
      width="40%"
    >
      <div style="height:460px;">
        <iframe :src="ifarmUrl" width="100%" height="100%" frameborder="0">
          您的浏览器不支持iframe，请升级
        </iframe>
      </div>

    </el-dialog> -->
  </div>
</template>

<script>
// import { QQ_LINK } from '@/util/constants';
export default {
  name: 'Login',
  components: {},
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码用户名'));
      }
      callback();
    };
    // 密码验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback();
    };
    var checkCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (value.length < 4) {
        callback(new Error('验证码应为4位'));
      } else {
        callback();
      }
    };
    return {

      // QQifarm
      qqDialogVisible: false,
      ifarmUrl: '',
      // 验证码数据
      imageBase64: null,
      // 登录数据
      loginForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      // 验证码id
      valid: '',
      // 验证规则
      rules: {
        username: [
          { validator: checkName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        verifyCode: [
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    // this.getCode();
  },
  methods: {
    // 获取验证码
    getCode() {
      this.$api.user.verificationCode()
        .then(res => {
          const { data: { data }} = res;
          this.imageBase64 = data.imageBase64;
          this.vid = data.vid;
        });
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginAjax();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 跳转登录
    toLogin() {
      this.resetForm('loginForm');
      this.$emit('typeChange');
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // qq登录
    loginQQ() {
      // this.qqDialogVisible = true;
      // this.ifarmUrl = QQ_LINK;
      window.location = QQ_LINK;
    },
    // 登录
    loginAjax() {
      const reqBody = {
        userInfo: {
          username: this.loginForm.username.trim(),
          password: this.loginForm.password
        },
        vid: this.vid,
        value: this.loginForm.verifyCode
      };
      this.$api.user.login(reqBody)
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('user', JSON.stringify(res.data.data));
            this.$store.dispatch('setUser', res.data.data);
            this.$store.dispatch('setLoginBoolean');
            this.$message.success(res.data.message);
          } else {
            this.$message.closeAll();
            this.$message.info(res.data.message);
          }
        })
        .catch(err => {
          console.error(err);
        });
      this.loading = false;
      this.getCode();
    }
  }
};
</script>

<style scoped lang="less">

</style>
