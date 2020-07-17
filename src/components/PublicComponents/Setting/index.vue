<template>
  <div class="index">
    <el-dialog
      title="设置"
      :visible.sync="localVisible"
      width="30%"
      @close="handleClose"
    >
      <el-button :disabled="isCheckEmail" @click="verifyEmail">{{ isCheckEmail?'已验证邮箱':'验证邮箱' }}</el-button>
      <el-button :disabled="isConnectQQ" @click="bindQQ">{{ isConnectQQ?'已绑定QQ':'绑定QQ' }}</el-button>
      <div>
        <!-- <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { QQ_LINK } from '@/util/constants';
export default {
  name: 'Index',
  components: {},
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imageUrl: '',
      columns: ['自动', 1, 2, 3, 4],
      isCheckEmail: false,
      isConnectQQ: false,
      column: 1
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.settingVisible;
      },
      set() { }
    }
  },
  watch: {},
  mounted() {
    // 验证状态
    this.$api.user.getEmailIsCheck(this.user.id)
      .then(res => {
        this.isCheckEmail = res.data.data;
      });
    this.$api.user.checkQQ(this.user.id)
      .then(res => {
        this.isConnectQQ = res.data.data;
      });

    const column = parseInt(localStorage.getItem('waterfull-column'));
    this.column = column || '自动';
  },

  methods: {
    // 创建url
    handleAvatarSuccess(res, file) {
      alert(file.raw);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    bindQQ() {
      window.open(QQ_LINK);
    },
    verifyEmail() {
      this.$api.user.vertifyEmail(this.user.email)
        .then(res => {
          this.$message.success(res.data.message);
        });
    },
    // 处理窗口关闭
    handleClose() {
      this.$emit('update:settingVisible', false);
    }
  }
};
</script>

<style scoped lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
