<template>
  <div class="artist">
    <virtual-list
      :identifier="identifier"
      :list="pictureList"
      @infinite="infinite"
    ><dir v-if="artistDetail" class="artist_property">
      <div class="artist-name">
        <div class="avatar">
          <img :src="artistDetail.avatarSrc" alt>
        </div>

        <div class="name">
          <h2>{{ artistDetail.name }}</h2>
        </div>
        <div>
          <span style="color: #999;">
            <em style="font-style:normal;color: #5C5C5C;font-weight: bold;">
              {{ artistDetail.totalFollowUsers }} </em>个关注者
          </span>
          <el-button
            round
            size="small"
            type="primary"
            @click="followArtist"
          >{{ artistDetail.isFollowed ? "已关注" : "添加关注" }}</el-button>
        </div>
      </div>
      <div style="margin:10px;text-align:center;disply:flex">
        <span v-if="artistDetail.region">
          <i class="el-icon-location-outline icon" />
          <em>{{ artistDetail.region }}</em>
        </span>
      </div>
      <div style="margin:10px;text-align:center;disply:flex">
        <i
          v-if="artistDetail.webPage"
          class="el-icon-s-home icon"
          @click="windowOpen(artistDetail.webPage)"
        />
        <i
          v-if="artistDetail.twitterUrl"
          class="el-icon-chat-dot-round icon"
          @click="windowOpen(artistDetail.twitterUrl)"
        />
        <i class="el-icon-share icon" />
      </div>
      <div class="comment">{{ artistDetail.comment }}</div>
    </dir>
    </virtual-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { replaceBigImg } from '@/util';
import VirtualList from '@/components/Virtual-List/VirtualList';
export default {
  name: 'Artist',
  components: {
    VirtualList
  },
  props: {
    artistId: {
      required: true,
      type: [String, Number]
    }
  },
  data() {
    return {
      artistDetail: null,
      page: 1,
      type: 'illust',
      identifier: +new Date(),
      illustSum: 0,
      mangaSum: 0,
      pictureList: []
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      if (val.artistId === this.artistDetail.id) {
        this.artistDetail.isFollowed = val.follow;
      }
    }
  },
  mounted() {
    this.getArtistInfo();
    this.getSummary();
  },
  methods: {
    windowOpen(url) {
      window.open(url);
    },
    // 取画家信息
    getArtistInfo() {
      this.$api.detail.reqArtist(this.artistId).then(res => {
        const {
          data: { data }
        } = res;
        this.artistDetail = {
          ...data,
          avatarSrc: replaceBigImg(data.avatar)
        };
      });
    },
    getSummary() {
      this.$api.detail.reqSummary(this.artistId).then(res => {
        const {
          data: { data }
        } = res;
        for (const item of data) {
          if (item.type === 'illust') {
            this.illustSum = item.sum;
          } else if (item.type === 'manga') {
            this.mangaSum = item.sum;
          }
        }
      });
    },
    handleClick() {
      this.$router.back();
    },
    infinite($state) {
      this.$api.detail
        .reqArtistIllust({
          page: this.page++,
          artistId: this.artistId,
          type: this.type
        })
        .then(res => {
          if (res.data.data) {
            const {
              data: { data }
            } = res;
            this.pictureList = this.pictureList.concat(data);
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getList(type) {
      this.type = type;
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
    },
    followArtist() {
      if (!this.user.id) {
        this.$message.info('请先登录');
        this.$store.dispatch('setLoginBoolean');
        return;
      }
      const data = {
        artistId: this.artistId,
        userId: this.user.id,
        username: this.user.username
      };
      if (!this.artistDetail.isFollowed) {
        this.artistDetail.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {
            this.artistDetail.totalFollowUsers++;
          })
          .catch(() => {
            this.artistDetail.isFollowed = false;
            this.$message.info('关注失败');
          });
      } else {
        this.artistDetail.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {
            this.artistDetail.totalFollowUsers--;
          })
          .catch(() => {
            this.artistDetail.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
.artist {
  height: calc(~"100vh - 60px");
  overflow: hidden;
  .artist_property {
    margin: 0 auto;
    width: 810px;
    padding-top: 60px;
    .artist-name {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .avatar {
        width: 150px;
        height: 150px;
        border-radius: 150px;
        display: inline-block;
        position: relative;
        border: 5px solid #fff;
        box-shadow: 0px 2px 3px #999;
        transition: all 0.2s ease-in-out 0s;
        img {
          width: 150px;
          height: 150px;
          border-radius: 150px;
        }
      }
      .name {
        display: flex;
      }
    }
  }
  .artist_illu {
    display: block;
    padding-top: 36px;
    padding-bottom: 64px;
    max-width: 1224px;
    margin: 0px auto;
  }
  .icon {
    font-size: 30px;
    height: 36px;
    width: 36px;
    color: #5e6d82;
    cursor: pointer;
  }
}
</style>
