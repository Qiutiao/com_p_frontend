<template>
  <div class="list">
    <VirtualCollection
      :cell-size-and-position-getter="cellSizeAndPositionGetter"
      :collection="list"
      :identifier="identifier"
      :width="width"
      :height="height"
      :column="column"
      @infinite="infinite"
    >
      <slot />
      <template v-slot:cell="props">
        <Item :column="props.data" @handleLike="handleLike" />
      </template>
    </VirtualCollection>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
import VirtualCollection from '@/components/Collect/VirtualCollection';
import throttle from 'lodash/throttle';
import Item from './Item';
import { randomColor, replaceBigImg, replaceSmallImg } from '@/util';
import { getClient } from '@/util/dom';
const columnWidth = 252;

export default {
  components: {
    VirtualCollection,
    Item
  },
  props: {
    listWidth: {
      type: Number,
      default: 0
    },
    lsitHeight: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    identifier: {
      type: Number,
      default: +new Date()
    }
  },
  data() {
    return {
      scrollY: 0,
      columnHeight: [],
      column: 0,
      width: this.listWidth || getClient().width - 65,
      height: this.lsitHeight || getClient().height
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'showTab']),
    listMap() {
      const map = new Map();
      for (const item of this.list) {
        map.set(item.id, item);
      }
      return map;
    }
  },
  watch: {
    list: {
      handler(val, old) {
        try {
          if (val.length === 0) {
            this.columnHeight = new Array(this.column).fill(0);
          } else {
            const list = val.filter(e => !old.includes(e) && e.xrestrict === 0 && e.sanityLevel <= 6);
            this.handleList(list);
          }
        } catch (error) {
          console.log(error, '*******');
        }
      }
    },
    likeStatus(val, old) {
      // 注意 List不一定找得到item 要判断下
      const { illustId, like } = val;
      const item = this.listMap.get(illustId);
      // this.$set(item, 'isLiked', like);
      if (item) {
        this.$set(item, 'isLiked', like);
      }
    }
  },
  mounted() {
    this.waterFall();
    window.addEventListener('resize', throttle(this.waterFall));
  },
  destroyed() {
    window.removeEventListener('resize', this.waterFall);
  },
  methods: {
    infinite($state) {
      this.$emit('infinite', $state);
    },
    cellSizeAndPositionGetter(item, index) {
      return {
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y
      };
    },
    handleLike(data) {
      if (!this.user.id) {
        this.$message.closeAll();
        this.$message.info('请先登录');
        return;
      }
      const item = this.listMap.get(data.id);
      const flag = item.isLiked;
      const params = {
        userId: this.user.id,
        illustId: data.id
      };
      if (!flag) {
        this.$set(item, 'isLiked', true); // 先强制视图更新 防止网络延迟不动
        this.$store.dispatch('handleCollectIllust', params)
          .then(() => {})
          .catch(() => {
            this.$set(item, 'isLiked', false); // 失败的话在改回去
            this.$message.closeAll();
            this.$message.error('收藏失败');
          });
      } else {
        this.$set(item, 'isLiked', false);
        this.$store.dispatch('deleteCollectIllust', params)
          .then(() => {})
          .catch(() => {
            this.$set(item, 'isLiked', true);
            this.$message.closeAll();
            this.$message.error('取消收藏失败');
          });
      }
    },
    waterFall() {
      this.width = this.listWidth || getClient().width - 65;
      this.height = this.lsitHeight || getClient().height;
      const column = parseInt(localStorage.getItem('waterfull-column'));
      if (column) {
        this.column = column;
      } else {
        this.column = Math.ceil(this.width / columnWidth);
      }
      this.columnHeight = new Array(this.column).fill(0);
      this.handleList(this.list);
    },
    handleList(list) {
      for (let i = 0; i < list.length; i++) {
        try {
          const tmp = list[i];
          const per = tmp.height / tmp.width;
          // const width = Math.floor((this.width - 100) / this.column);
          const width = 252;
          // const height = Math.max(Math.min(width * per, 400), 100);
          const height = width * per;
          // 找出最小列
          let minHeight = this.columnHeight[0];
          let index = 0;
          for (let j = 0; j < this.columnHeight.length; j++) {
            if (minHeight > this.columnHeight[j]) {
              minHeight = this.columnHeight[j];
              index = j;
            }
          }
          tmp.x = index * width;
          tmp.y = this.columnHeight[index];
          this.columnHeight[index] += height;

          tmp['height'] = height;
          tmp['width'] = width;
          tmp['src'] = replaceSmallImg(tmp.imageUrls[0].medium);
          tmp['setu'] = !!((tmp.xrestrict === 1 || tmp.sanityLevel > 6)) && this.user.username !== 'pixivic';
          tmp['style'] = {
            backgroundColor: randomColor()
          };
          tmp['itemHeight'] = parseInt(per * this.width);
          tmp['avatarSrc'] = replaceBigImg(tmp.artistPreView.avatar);
          tmp['createDate'] = dayjs(tmp.createDate).format('YYYY-MM-DD');
          tmp['imgs'] = tmp.imageUrls.reduce((pre, cur) => {
            return pre.concat(replaceBigImg(cur.original));
          }, []);
          tmp['originalSrc'] = replaceBigImg(tmp.imageUrls[0].original);
          tmp['isad'] = tmp.type === 'ad_image' || tmp.type === 'donate';
        } catch (error) {
          console.log(error, '*******_!');
        }
      }
    }
  }
};
</script>

<style lang="stylus" scope>
.list {
  position: relative;
  background-color: #fff;
}
</style>
