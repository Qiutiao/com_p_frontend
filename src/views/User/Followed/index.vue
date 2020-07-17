<template>
  <div class="followed">
    <ul v-infinite-scroll="getFollowArtists" class="artist-list" infinite-scroll-immediate infinite-scroll-distance="10" infinite-scroll-delay="1000">
      <li
        v-for="artistItem in artistList"
        :key="artistItem.id"
        class="artist-item"
      >
        <div class="avatar" @click="goArtist(artistItem.id)">
          <el-avatar :size="80" :src="artistItem.avatar | replaceBig" />
        </div>
        <div class="info">
          <div class="name">{{ artistItem.name }}</div>
          <div class="desc">{{ artistItem.comment }}</div>
          <div class="followed-button">
            <el-button
              round
              type="primary"
              @click="follow(artistItem)"
            >{{ artistItem.isFollowed ? "已关注" : "添加关注" }}</el-button>
          </div>
        </div>
        <div class="picture">
          <ul class="picture-array">
            <li
              v-for="(item, index) in artistItem.recentlyIllustrations.filter(item => item.xrestrict === 0 && item.sanityLevel <= 6)"
              :key="index"
              class="picture-item"
              @click="goDetail(item)"
            >
              <el-image
                :src="item.imageUrls[0].squareMedium | replaceImg"
                class="small-img"
                fit="cover"
                lazy
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="title">{{ item.title }}</div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- <div class="pix-page">
      <el-pagination
        :current-page="page.page"
        background
        layout="prev, pager, next"
        :total="10"
        @current-change="handlePageChange"
      />
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Followed',
  components: {},
  filters: {
    replaceImg(val) {
      return (
        'https://img.cheerfun.dev:233/c/360x360_70/img-master' +
        val.split('img-master')[1]
      );
    }
  },
  data() {
    return {
      page: { page: 0, pageSize: 10 },
      artistList: [],
      listMap: new Map(),
      userId: null,
      height: 0
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      const { artistId, follow } = val;
      const item = this.listMap.get(artistId);
      if (item) {
        this.$set(item, 'isFollowed', follow);
      }
    }
  },
  mounted() {
    const { userId } = this.$route.query;
    this.userId = userId || this.user.id;
    this.getFollowArtists();
  },
  created() {},
  methods: {
    handlePageChange(v) {
      this.page = v;
      this.getFollowArtists();
    },
    // 获取关注列表
    getFollowArtists() {
      if (this.artistList.length < this.page.page * this.page.pageSize && this.page.page !== 1) {
        this.$message.info('关注列表已到底');
        return;
      }
      this.$api.user
        .getArtists({
          page: ++this.page.page,
          pageSize: this.page.pageSize,
          userId: this.userId
        })
        .then(res => {
          const {
            data: { data }
          } = res;
          if (!data) {
            this.$message.info('关注列表已到底');
          } else {
            this.artistList = this.artistList.concat(data);
            for (const item of data) {
              this.listMap.set(item.id, item);
            }
          }
        });
    },
    follow(item) {
      const val = this.listMap.get(item.id);
      const data = {
        artistId: val.id,
        userId: this.user.id,
        username: this.user.username
      };
      if (val.isFollowed) {
        val.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {})
          .catch(() => {
            val.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      } else {
        val.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {})
          .catch(() => {
            val.isFollowed = false;
            this.$message.info('关注失败');
          });
      }
    },
    goArtist(id) {
      this.$router.push(`/artist/${id}`);
    },
    goDetail(data) {
      this.$store.dispatch('setDetail', data);
      this.$router.push(`/illusts/${data.id}`);
    }
  }
};
</script>

<style scoped lang="less">
.followed {
  max-height: calc(~"100vh - 60px");
  overflow-y: scroll;
  background: #fff;
  .artist-list {
    max-height: calc(100vh - 100px);
    max-width: 1044px;
    margin: 0px auto 24px;
    padding: 0px;
    .artist-item {
      display: flex;
      align-items: flex-start;
      list-style: none;
      padding: 24px 0px;
      border-bottom: 1px solid rgb(235, 235, 235);
      .info {
        width: 296px;
        margin-left: 16px;
        .name {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          text-decoration: none;
        }
        .desc {
          margin-top: 5px;
          word-break: break-all;
          font-size: 14px;
          line-height: 20px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .followed-button {
          margin-top: 14px;
        }
      }
      .picture {
        flex-shrink: 0;
        margin-left: 24px;
        .picture-array {
          display: flex;
          list-style: none;
          padding: 0;
          .picture-item {
            margin-right: 24px;
            .small-img {
        width: 180px;
        height: 180px;
      }
            .title {
              display: block;
              max-width: 180px;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 22px;
              font-size: 14px;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.88);
              overflow: hidden;
              text-decoration: none;
              transition: color 0.2s ease 0s;
            }
          }
        }
      }
    }
  }
  .pix-page{
    width: 1000px;
    margin: 0 auto;
    text-align: center;;
  }
}
/deep/.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>
