<template>
  <div
    ref="outer"
    class="vue-virtual-collection"
    :style="outerStyle"
    @scroll.passive="onScroll"
  >
    <div class="vue-virtual-collection-container">
      <slot />
      <div ref="watercontent" class="water-content" :style="contentStyle">
        <div
          v-for="item in displayItems"
          :key="item.id"
          class="cell-container"
          :style="getComputedStyle(item)"
        >
          <slot name="cell" :data="item" />
        </div>
      </div>
    </div>
    <div :class="['top', { 'is-active': showTab }]" @click.stop="scrollToTop">
      <svg font-size="30" class="icon" aria-hidden="true">
        <use xlink:href="#picdingbu1" />
      </svg>
    </div>
    <infinite-loading :identifier="identifier" @infinite="infinite">
      <div slot="no-more" />
      <div slot="no-results" style="marginTop: 50px;">
        <svg font-size="160" class="icon" aria-hidden="true">
          <use xlink:href="#pickongtai1" />
        </svg>
        <p style="color: #E3F2FA; font-size: 20px;">没有内容</p>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapGetters } from 'vuex';
import GroupManager from './GroupManager';
import { getClient } from '@/util/dom';
export default {
  components: {
    InfiniteLoading
  },
  props: {
    cellSizeAndPositionGetter: {
      type: Function,
      required: true
    },
    collection: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      validator(value) {
        return value >= 0;
      },
      default: getClient().height
    },
    width: {
      type: Number,
      validator(value) {
        return value >= 0;
      },
      default: getClient().width
    },
    sectionSize: {
      type: Number,
      default: getClient().width
    },
    identifier: {
      type: Number,
      default: +new Date()
    },
    column: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      totalHeight: 0,
      totalWidth: 0,
      displayItems: [],
      scrollY: 0
    };
  },
  computed: {
    ...mapGetters([
      'showTab'
    ]),
    outerStyle() {
      return {
        // height: this.height + 'px',
        width: this.width + 'px'
      };
    },
    contentStyle() {
      return {
        width: 252 * this.column + 'px',
        height: `${this.totalHeight}px`
      };
    },
    dateChange() {
      return {
        collection: this.collection,
        column: this.column
      };
    }
  },
  watch: {
    dateChange() {
      // Dispose previous groups and reset associated data
      this.groupManagers.forEach(manager => manager.dispose());
      this.groupManagers = [];
      this.totalHeight = 0;
      this.totalWidth = 0;
      this.onCollectionChanged();
    },
    identifier() {
      this.totalHeight = 0;
    }
  },
  created() {
    this.groupManagers = [];
    this.onCollectionChanged();
  },
  activated() {
    this.$refs.outer.scrollTop = this.scrollY;
  },
  methods: {
    onCollectionChanged() {
      let collection = this.collection;
      // If the collection is flat, wrap it inside a single group
      if (collection.length > 0 && collection[0].group === undefined) {
        collection = [{ group: collection }];
      }
      // Create and store managers for each item group
      collection.forEach((groupContainer, i) => {
        const groupIndex = i; // Capture group index for closure
        const unwatch = this.$watch(
          () => groupContainer,
          () => this.onGroupChanged(groupContainer.group, groupIndex),
          { deep: true }
        );
        this.groupManagers.push(new GroupManager(
          groupContainer.group,
          groupIndex,
          this.sectionSize,
          this.cellSizeAndPositionGetter,
          unwatch
        ));
      });
      this.updateGridDimensions();
      this.flushDisplayItems();
    },
    updateGridDimensions() {
      this.totalHeight = Math.max(...this.groupManagers.map(it => it.totalHeight));
      this.totalWidth = Math.max(...this.groupManagers.map(it => it.totalWidth));
    },
    onGroupChanged(group, index) {
      this.groupManagers[index].updateGroup(group);
      this.updateGridDimensions();
      this.flushDisplayItems();
    },
    getComputedStyle(displayItem) {
      if (!displayItem) return;
      // Currently displayed items may no longer exist
      // if collection has been modified since
      const groupManager = this.groupManagers[displayItem.groupIndex];
      if (!groupManager) return;
      const cellMetadatum = groupManager.getCellMetadata(displayItem.itemIndex);
      if (!cellMetadatum) return;
      const { width, height, x, y } = cellMetadatum;
      return {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`
      };
    },
    onScroll(e) {
      this.flushDisplayItems();
      this.scrollY = this.$refs.outer.scrollTop;
    },
    flushDisplayItems() {
      let scrollTop = 0;
      let scrollLeft = 0;
      if (this.$refs.outer) {
        scrollTop = this.$refs.outer.scrollTop;
        scrollLeft = this.$refs.outer.scrollLeft;
      }
      const displayItems = [];
      this.groupManagers.forEach((groupManager, groupIndex) => {
        var indices = groupManager.getCellIndices({
          height: this.height,
          width: this.width,
          x: scrollLeft,
          y: scrollTop - this.$refs.watercontent.offsetTop
        });
        indices.forEach(itemIndex => {
          displayItems.push(Object.freeze({
            groupIndex,
            itemIndex,
            key: displayItems.length,
            ...groupManager.getItem(itemIndex)
          }));
        });
      });
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          this.displayItems = displayItems;
          this.$forceUpdate();
        });
      } else {
        this.displayItems = displayItems;
        this.$forceUpdate();
      }
    },
    infinite($state) {
      this.$emit('infinite', $state);
    },
    scrollToTop() {
      this.$refs.outer.scrollTop = 0;
    }
  }
};
</script>

<style lang="stylus" scoped>
.vue-virtual-collection
  overflow scroll
  -webkit-overflow-scrolling touch
  box-sizing border-box
  // padding-left 50px
  // padding-right 50px
  height 100vh
  // &::-webkit-scrollbar
  //   display none /* Chrome Safari */
  &-container
    position relative
    background #fff
    box-sizing border-box
    .water-content
      position relative
      margin 10px auto
      .cell-container
        position absolute
        top 0
  .top
    position fixed
    bottom 27.5px
    right 10px
    width 30px
    height 30px
    transform translateY(100px)
    transition all 1s
    opacity 0
    &.is-active
      transform translateY(0)
      opacity 1
</style>
