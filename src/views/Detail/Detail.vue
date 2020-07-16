<template>
  <div v-if="illustDetail" class="detail">
    <div class="page-padding">
      <main class="detail-content">
        <figure class="detail-content__figure">
          <el-image
            v-if="illustDetail.xrestrict==0&&illustDetail.sanityLevel<=6"
            :preview-src-list="srcList"
            :src="illustDetail.originalSrc"
            fit="contain"
            style="width:100%;height:80vh;"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </figure>
        <div class="detail-content__action">
          <div
            :class="['like', { 'is-like': illustDetail.isLiked }]"
            @click="handleLike(illustDetail)"
          />
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="正在施工中"
          >
            <a v-if="likeUsers" slot="reference" class="users">
              <el-avatar
                v-for="item in likeUsers"
                :key="item.userId"
                :size="40"
                :src="item.userId | replaceAvatar"
                @click="goUsers"
              />
            </a>
          </el-popover>
        </div>
        <figcaption class="detail-content__info">
          <div class="card">
            <h1>{{ illustDetail.title }}</h1>
            <div class="disc">{{ illustDetail.caption }}</div>
            <div class="tags">
              <ul>
                <li
                  v-for="item of illustDetail.tags"
                  :key="item.id"
                  :title="item.translatedName"
                  @click="openTag(item)"
                >
                  #{{ item.name }}
                </li>
              </ul>
            </div>
            <ul class="populor">
              <li title="阅读数">
                <i class="el-icon-view" />
                {{ illustDetail.totalView }}
              </li>
              <li title="收藏数">
                <i class="el-icon-star-off" />
                {{ illustDetail.totalBookmarks }}
              </li>
            </ul>
            <div class="date" title="投稿时间">
              {{ illustDetail.createDate }}
            </div>
          </div>
        </figcaption>
        <figcaption class="detail-content__comment">
          <Comment :comments="commentList" :pid="pid" />
        </figcaption>
        <figcaption class="detail-content__relate">
          <h2 class="relate-title">相关作品</h2>
          <div>
            <ul v-infinite-scroll="reqRelatedIllust" infinite-scroll-immediate class="relate-info" infinite-scroll-distance="10" infinite-scroll-delay="1000">
              <li v-for="item in relatedPictureList" :key="item.id">
                <Item :illust="item" @handleLike="handleLike" />
                <!-- <el-image :src="url" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image> -->
              </li>
            </ul>
          </div>

        </figcaption>
      </main>
      <!-- 作者信息 -->
      <aside class="detail-author">
        <section class="artist-info" @click="goArtistPage">
          <el-avatar :src="illustDetail.avatarSrc" size="medium" />
          <h2>{{ illustDetail.artistPreView.name }}</h2>
        </section>
        <section style="margin:10px 20px;text-align:center;">
          <el-button
            round
            size="small"
            type="primary"
            @click="followArtist"
          >{{
            illustDetail.artistPreView.isFollowed ? "已关注" : "添加关注"
          }}</el-button>
        </section>
        <section class="artist-preview">
          <template v-for="item in pictureList">
            <el-image
              :key="item.id"
              :src="item.imageUrls[0].medium | replaceSmall"
              fit="cover"
              class="small-img"
              lazy
              @click.native="goDetail(item)"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>

        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { replaceBigImg, replaceSmallImg } from '@/util';
import dayjs from 'dayjs';
import Item from '@/components/Virtual-List/MyItem';
import Comment from '@/components/PublicComponents/Comment';

export default {
  name: 'Detail',
  components: {
    Item,
    Comment
  },
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      commentList: [],
      page: 1,
      srcList: [],
      illustDetail: null,
      imageList: [],
      isLiked: false,
      type: 'illust',
      pictureList: [],
      relatedPictureList: [],
      likeUsers: []
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus', 'detail'])
  },
  watch: {
    // 详情去画师那里更改点赞状态 然后后退回来详情 状态也要变
    likeStatus(val, old) {
      const { illustId, like } = val;
      if (illustId === this.illustDetail.id) {
        this.illustDetail.isLiked = like;
      }
    },
    followStatus(val) {
      if (val.artistId === this.illustDetail.artistPreView.id) {
        this.illustDetail.artistPreView.isFollowed = val.follow;
      }
    }
  },
  mounted() {
    if (this.detail) {
      this.illustDetail = this.handleData(JSON.parse(JSON.stringify(this.detail)));
    } else {
      this.getIllustDetail();
    }
    this.bookmarkedUsers();
    this.getCommentsList();
  },
  methods: {
    // 等待后端分页处理
    getCommentsList() {
      this.$api.comment.getComments({
        commentAppType: 'illusts',
        commentAppId: this.pid
      })
        .then(res => {
          if (res.status === 200) {
            this.commentList = res.data.data || [];
          }
        });
    },
    // 处理图片数据
    handleData(data) {
      this.getArtistIllust(data.artistId);
      this.srcList = data.imageUrls.filter(item => item.xrestrict !== 1 && item.sanityLevel <= 6).map(e => replaceBigImg(e.original)) || [];
      return {
        ...data,
        itemHeight: data.itemHeight || parseInt((data.height / data.width) * document.body.clientWidth),
        originalSrc: data.originalSrc || replaceBigImg(data.imageUrls[0].original),
        src: data.src || replaceSmallImg(data.imageUrls[0].medium),
        avatarSrc: data.avatarSrc || replaceBigImg(data.artistPreView.avatar),
        createDate: dayjs(data.createDate).format('YYYY-MM-DD'),
        setu: data.setu || !!((data.xrestrict === 1 || data.sanityLevel > 6)) && this.user.username !== 'pixivic',
        imgs: data.imgs || data.imageUrls.reduce((pre, cur) => {
          return pre.concat(replaceBigImg(cur.original));
        }, [])
      };
    },
    // 跳转到搜藏用户
    goUsers() {},
    // 书签用户
    bookmarkedUsers() {
      this.$api.detail
        .bookmarkedUsers({
          illustId: this.pid,
          pageSize: 3
        })
        .then(res => {
          this.likeUsers = res.data.data;
        });
    },
    // 跳转详情
    goDetail(data) {
      this.$store.dispatch('setDetail', data);
      this.$router.push(`/illusts/${data.id}`);
    },
    goArtistPage() {
      this.$router.push(`/artist/${this.illustDetail.artistId}`);
    },
    handleLike(data) {
      this.$message.closeAll();
      if (!this.user.id) {
        this.$message.info('请先登录');
        return;
      }
      const flag = data.isLiked;
      data.isLiked = !data.isLiked;
      const params = {
        userId: this.user.id,
        illustId: data.id
      };
      if (!flag) {
        this.$store.dispatch('handleCollectIllust', params)
          .then(e => {
            this.$message.success(e.data.message);
          })
          .catch(e => {
            data.isLiked = !data.isLiked;
            this.$message.error(e.data.message);
          });
      } else {
        this.$store.dispatch('deleteCollectIllust', params)
          .then(e => {
            this.$message.success(e.data.message);
          }
          )
          .catch(e => {
            data.isLiked = !data.isLiked;
            this.$message.error(e.data.message);
          });
      }
    },
    openTag(item) {
      this.$router.push({
        path: `/keywords/${item.name}`,
        query: {
          illustType: this.type
        }
      });
    },
    // 请求数据
    getIllustDetail() {
      this.$api.detail.reqIllustDetail(this.pid).then(res => {
        const data = res.data.data;
        this.illustDetail = this.handleData(data);
      });
    },
    followArtist() {
      if (!this.user.id) {
        this.$message.info('请先登录');
        this.$store.dispatch('setLoginBoolean');
        return;
      }
      const data = {
        artistId: this.illustDetail.artistPreView.id,
        userId: this.user.id,
        username: this.user.username
      };
      if (!this.illustDetail.artistPreView.isFollowed) {
        this.illustDetail.artistPreView.isFollowed = true;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = false;
            this.$message.info('关注失败');
          });
      } else {
        this.illustDetail.artistPreView.isFollowed = false;
        this.$store
          .dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = true;
            this.$message.info('取消关注失败');
          });
      }
    },
    // 获取画家信息
    getArtistIllust(artistId) {
      this.$api.detail
        .reqArtistIllust({
          page: 1,
          artistId: artistId,
          type: this.type,
          pageSize: 10
        })
        .then(res => {
          if (res.data.data) {
            const {
              data: { data }
            } = res;
            this.pictureList = this.pictureList.concat(data);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    reqRelatedIllust() {
      this.$api.detail
        .reqRelatedIllust({
          page: this.page++,
          illustId: this.pid
        })
        .then(res => {
          if (!res.data.data) {
            this.$message.info('到底了');
          } else {
            this.relatedPictureList = this.relatedPictureList.concat(
              res.data.data
            );
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped lang="less">
@keyframes heart {
  0% {
    background-position: left;
  }

  100% {
    background-position: right;
  }
}
.detail {
  max-height: calc(~"100vh - 60px");
  display: flex;
  justify-content: center;
  .page-padding {
    padding: 20px;
    display: flex;
  }
  &-content {
    width: 1000px;
    flex: 0 0 auto;
    background-color: #fff;
    &__figure {
      margin: 20px;
    }
    &__action {
      display: flex;
      justify-content: flex-end;
      background: #fff;
      padding: 0 20px;
      .users {
        display: flex;
      }
      .like {
        width: 80px;
        height: 40px;
        background: url("../../assets/img/like.png") no-repeat;
        background-position: left;
        background-size: 2900%;
      }
      .is-like {
        background-position: right;
        animation: heart 0.8s steps(28);
      }
    }
  &__comment{
      padding: 48px 16px;
     margin: 0 auto;
    }
    &__info {
      padding: 48px 16px;
      display: flex;
      margin: 0 auto;
      background: #fff;
      .card {
        width: 600px;
        h1 {
          color: rgb(28, 28, 28);
          font-size: 20px;
          line-height: 24px;
          font-weight: bold;
          margin: 0px 0px 8px;
        }
        .disc {
          color: rgb(92, 92, 92);
          line-height: 1.33;
          margin: 0px;
          overflow: hidden;
        }
        .tags {
          display: flex;
          color: rgb(61, 118, 153);
          line-height: 18px;
          margin: 16px 0px;
          ul {
            margin: 0 -6px 0 0;
            list-style: none;
            padding-left: 0;
            word-break: break-all;
            li {
              display: inline;
              margin: 0 12px 0 0;
              cursor: pointer;
            }
          }
        }
        .populor {
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          margin: 16px -4px;
          list-style: none;
          padding: 0px;
          li {
            flex: 0 0 auto;
            margin: 0px 8px;
            display: list-item;
            text-align: -webkit-match-parent;
            font-size: 12px;
            color: rgb(173, 173, 173);
          }
        }
        .date {
          color: rgb(173, 173, 173);
          font-size: 12px;
          line-height: 1;
        }
      }
    }
    &__relate {
      padding: 0px 16px;
      .relate-title {
        font-size: 20px;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.64);
        margin: 0px;
      }
      .relate-info {
        list-style: none;
        display: grid;
        gap: 24px;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, 184px);
        -webkit-box-pack: center;
        justify-content: flex-start;
        margin: 0px;
        margin-bottom: 20px;
        padding: 0px;
      }
    }
  }
  &-author {
    margin-left: 24px;
    width: 288px;
    flex: 0 0 auto;
    background: #fdfdfd;
    .artist-info {
      display: flex;
      padding: 16px;
      border-radius: 8px;
      align-items: center;
      h2 {
        font-size: 1em;
        font-weight: bold;
        margin-left: 6px;
        word-break: break-all;
        color: rgb(31, 31, 31);
        text-decoration: none;
      }
    }
    .artist-preview {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      .small-img {
        width: 80px;
        height: 80px;
      }
    }
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
