<template>
  <div class="tags">
    <div
      v-for="(item, index) in data"
      :key="index"
      :style="{
        justifyContent: item.keywordTranslated ? 'space-between' : 'center'
      }"
      class="tags-item"
      @click.prevent="handleClick(item)"
    >
      <el-tag style="height:50px;">
        <div>{{ item.keyword || item.name }}</div>
        <span v-if="item.keywordTranslated">{{ item.keywordTranslated || item.translatedName }}</span>
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleClick(item) {
      this.$emit('handleClick', item);
    }
  }
};
</script>

<style scoped lang="less">

.tags {
  padding: 0 10px;
  display: -webkit-box;
  overflow-x: scroll;
  position: relative;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    display: none;
  }

  .tags-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: Arial;
    width: auto;
    margin-right: 7px;
    margin-bottom: 10px;
    text-align: center;
    color: white;

    div {
      line-height: 30px;
      font-size: 16px;
      white-space: nowrap;
    }

    span {
      line-height: 10px;
      font-size: 10px;
      white-space: nowrap;
    }
  }
}
</style>
