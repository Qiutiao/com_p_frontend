<!--
 * @Author: gooing
 * @since: 2020-03-30 22:38:24
 * @lastTime: 2020-04-07 14:09:27
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\components\Virtual-List\MyItem.vue
 * @message:
 -->
<template>
  <div class="my-item">
    <div class="my-item-content" :style="{height:size+'px',width:size+'px'}" @click="goDetail">
      <el-image
        v-if="illust.xrestrict===0&&illust.sanityLevel<=6"
        :src="illust.imageUrls[0].medium | replaceSmall"
        fit="cover"
        :style="{height:size+'px',width:size+'px'}"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" />
        </div>
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <div v-else class="setu-filter">
        <svg font-size="50" class="icon" aria-hidden="true">
          <use xlink:href="#picsuo2" />
        </svg>
      </div>
      <div v-if="illust.pageCount > 1" class="count">
        <img src="../../assets/img/count.svg">
        <span>{{ illust.pageCount }}</span>
      </div>
      <Like :like="illust.isLiked" @handleLike="handleLike" />
    </div>
  </div>
</template>

<script>
import Like from '@/components/Like/Like';
export default {
  name: 'MyItem',
  components: {
    Like
  },
  props: {
    illust: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      default: 180
    }
  },
  data() {
    return {
      opacity: 0
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleLike() {
      this.$emit('handleLike', this.illust);
    },
    goDetail() {
      if (this.illust.isad) {
        window.open(this.illust.link);
      } else {
        this.$store.dispatch('setDetail', this.illust);
        this.$router.push(`/illusts/${this.illust.id}`);
      }
    }
  }
};
</script>

<style scoped lang="less">

.my-item{
  box-sizing: border-box;
  overflow: hidden;

  &-content {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      transition: opacity 0.3s, transform 0.3s ease;
      object-fit: cover;
      border-radius: 16px;
    }

    .img-filter {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
    }
  }
  &:hover {
    img {
      transform: scale(1.3);
    }
  }
   .count {
    position: absolute;
    display: inline-block;
    top: 8px;
    right: 8px;
    color: white;
    background-color: #0000009e;
    padding: 2px;
    border-radius: 4px;

    img {
      float: left;
      fill: white;
      height: 20px;
      width: 20px;
    }

    span {
      float: right;
      padding: 0 2px;
      line-height: 20px;
    }

  }
  .setu-filter {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 50px;
    margin: auto;
    z-index: 2;
  }

}
</style>
