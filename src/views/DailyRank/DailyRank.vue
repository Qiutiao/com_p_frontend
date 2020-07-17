<!--
 * @Author: gooing
 * @since: 2020-01-28 23:11:51
 * @lastTime: 2020-04-01 22:05:09
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\DailyRank\DailyRank.vue
 * @message:
 -->
<template>
  <div class="DailyRank">
    <virtual-list
      :identifier="identifier"
      :list="pictureList"
      @infinite="infinite"
    >
      <el-popover
        placement="left"
        style="position:fixed;z-index:999;right:40px;bottom:20px;"
        trigger="hover"
        width="240"
      >
        <template>
          <el-radio v-model="modeFather" label="0">综合排行</el-radio>
          <el-radio v-model="modeFather" label="1">漫画排行</el-radio>
        </template>
        <el-radio-group
          v-model="mode"
          size="mini"
          style="padding: 20px 0;"
          @change="resetData"
        >
          <el-radio-button
            v-for="radioItem of modeList[modeFather].children"
            :key="radioItem.name"
            :label="radioItem.value"
          >{{ radioItem.name }}</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="value2"
          :picker-options="pickerOptions"
          align="right"
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          @change="selectDate"
        />
        <div slot="reference">
          <svg aria-hidden="true" class="icon" font-size="40">
            <use xlink:href="#picshizhong1" />
          </svg>
        </div>
      </el-popover>
    </virtual-list>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import VirtualList from '@/components/Virtual-List/VirtualList';

export default {
  name: 'DailyRank',
  components: {
    VirtualList
  },
  data() {
    return {
      modeFather: '0',
      modeList: [
        {
          name: '综合排行',
          children: [
            { name: '日', value: 'day' },
            { name: '周', value: 'week' },
            { name: '月', value: 'month' },
            { name: '女性', value: 'female' },
            { name: '男性', value: 'male' }
          ]
        },
        {
          name: '漫画排行',
          children: [
            { text: '日排行', value: 'day_manga' },
            { text: '周排行', value: 'week_manga' },
            { text: '月排行', value: 'month_manga' },
            { text: '新秀周排行', value: 'week_rookie_manga' }
          ]
        }
      ],
      page: 1,
      mode: 'day',
      date: null,
      pictureList: [],
      identifier: +new Date(),
      value2: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.date = dayjs(new Date())
      .add(-3, 'days')
      .format('YYYY-MM-DD');
    localStorage.setItem('waterfull-column', 4);
  },
  methods: {
    infinite($state) {
      this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        })
        .then(res => {
          if (!res.data.data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data);
            $state.loaded();
          }
        });
    },
    changeData(e) {
      console.log(e);
    },
    resetData() {
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
    },
    selectDate(date) {
      this.date = date;
      this.resetData();
    },
    selectMode() {
      this.resetData();
    }
  }
};
</script>

<style scoped lang="less">
.DailyRank {
  height: calc(~"100vh - 60px");
  overflow-y: hidden;
  width: calc(~"100%");
  display: flex;
  justify-content: center;
}
</style>
