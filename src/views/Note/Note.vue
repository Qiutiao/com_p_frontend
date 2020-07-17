<!--
 * @Author: gooing
 * @since: 2020-02-11 20:20:39
 * @lastTime: 2020-04-03 09:48:26
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\Note\Note.vue
 * @message:
 -->
<template>
  <div class="note">
    <div class="content-list">
      <el-card>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item
            v-for="(item, index) in noteInfo"
            :key="item.title"
            :name="index"
          >
            <template slot="title">
              <span class="title">{{ item.title }}</span>
            </template>
            <ul class="list">
              <li v-for="e in item.content" :key="e">{{ e }}</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item :name="6">
            <template slot="title">
              <span class="title">开发人员</span>
            </template>
            <div class="devs">
              <a
                v-for="dev of devsInfo"
                :key="dev.herf"
                style="cursor: pointer;margin-right:20px;"
                :href="dev.href"
                target="_Blank"
              >
                <el-avatar shape="square" size="medium" :src="dev.src" />
              </a>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Note',
  components: {},
  data() {
    return {
      activeNames: [0],
      // 相关信息
      noteInfo: [
        {
          title: '关于',
          content: [
            '前端项目地址 https://github.com/Qiutiao/com_p_frontend',
            '该系统为不便于访问Pixiv的内地PC用户提供以下有限的服务："Pixiv日排行的浏览"与"免费高级会员热门排序搜索"。',
            '开发该前端项目所调用API的方式参考了cheerfun团队编写的Pixivic的API文档',
            '请使用Chrome，Firefox等主流浏览器访问该系统，请勿使用任何应用的内置的浏览器访问本站点。',
            '首页直接搜索跳转的兼容性不佳，若在首页跳转后的搜索结果并不是你想要的，在该页面重新键入搜索词回车即可。',
            '默认最新一期为当前日期前天的排行数据，点击右下角工具可进行日期的选定。',
            '本系统不会存放任何图片文件，本站不会依赖这些图片来用于任何盈利性行为，并已在详情页标注出插画作者以及介绍信息，点击大图可跳转该作品在pixiv的所属页面',
            
          ]
        },
      ],
      // 开发人员
      devsInfo: [
        {
          href: 'https://github.com/Qiutiao',
          src: require('@/assets/img/0001.jpeg')
        }
      ]
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style scoped lang="less">
.note {
  min-height: calc(~"100vh - 60px");
  max-height:calc(~"100vh - 60px");
  width: calc(~"100vw - 65px");
  overflow: auto;
  .content-list {
    width: 50%;
    margin: 20px auto;
    .list {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .title {
      font-size: 22px;
      font-weight: 400;
      color: #1f2d3d;
    }
    .devs {
      display: flex;
    }
  }
}
</style>
