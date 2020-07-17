<template>
  <div class="LeftSide">
    <el-menu
      :collapse="isCollapse" :default-active="computerActiveNav" class="el-menu-vertical-demo" @close="handleClose" @select="handleOpen"
    >
      <el-menu-item
        v-for="item of navLsit" :key="item.id" :index="item.routePath"
      >
        <i :class="[item.icon]" />
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
    
  </div>
</template>

<script>
export default {
    name: 'LeftSide',
    data() {
      return {
        isCollapse: true,
        navLsit: [
          {
            id: '0',
            name: '首页',
            icon: 'el-icon-s-home',
            routePath: '/'
          },
          {
            id: '1',
            name: '须知',
            icon: 'el-icon-document',
            routePath: '/note'
          }
          
        ]
      };
  },
  computed: {
    computerActiveNav() {
      let result = '0';
      const index = this.navLsit.indexOf(
        item => item.routePath === this.$route.path
      );
      if (index !== -1) {
        result = '' + index;
      }
      return result;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      this.$router.push({ path: key, query: {}});
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped lang="less">
.LeftSide {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
}
</style>