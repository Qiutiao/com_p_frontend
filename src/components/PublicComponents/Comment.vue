<template>
  <div class="container">
    <div v-for="item in comments" :key="item.id" class="comment">
      <div class="info">
        <img
          class="avatar"
          :src="
            item.replyFrom
              ? `https://pic.cheerfun.dev/${item.replyFrom}.png`
              : ''
          "
          width="36"
          height="36"
        >
        <div class="right">
          <div class="name">{{ item.replyFromName }}</div>
          <div class="date">{{ item.createDate | dateFormat }}</div>
        </div>
      </div>
      <div style="padding-left:44px;">
        <div class="content">{{ item.content }}</div>
        <div class="control">
          <!-- <span class="like" :class="{active: item.isLike}" @click="likeClick(item)">
          <i class="iconfont icon-like" />
          <span class="like-num">{{ item.likeNum > 0 ? item.likeNum + '人赞' : '赞' }}</span>
        </span> -->
          <span class="comment-reply" @click="showCommentInput(item, 1)">
            <i class="iconfont el-icon-chat-square" />
            <span>回复</span>
          </span>
        </div>
      </div>

      <div class="reply">
        <template v-if="item.subCommentList">
          <div v-for="reply in item.subCommentList" :key="reply.id" class="comment-item">
            <div class="reply-content">
              <span class="from-name">{{ reply.replyFromName }}</span><span>: </span>
              <span class="to-name">@{{ reply.replyToName }}</span>
              <span>{{ reply.content }}</span>
            </div>
            <div class="reply-bottom">
              <span>{{ reply.date }}</span>
              <span class="reply-text" @click="showCommentInput(item, 1)">
                <i class="iconfont el-icon-chat-square" />
                <span>回复</span>
              </span>
            </div>
          </div>
        </template>
        <transition name="fade">
          <div
            v-if="showItemId === item.id"
            class="input-wrapper"
            style="padding-left:44px;"
          >
            <el-input
              v-model="inputComment"
              class="gray-bg-input"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的评论..."
            />
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button
                class="btn"
                type="success"
                round
                @click="submitComment(item)"
              >确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="write-reply" @click="showCommentInput(item)">
      <i class="el-icon-edit" />
      <span class="add-comment">添加新评论</span>
    </div>
    <transition name="fade">
      <div v-if="showItemId === 'new'" class="input-wrapper">
        <el-input
          v-model="inputComment"
          class="gray-bg-input"
          type="textarea"
          :rows="3"
          autofocus
          placeholder="写下你的评论..."
        />
        <div class="btn-control">
          <span class="cancel" @click="cancel">取消</span>
          <el-button
            class="btn"
            type="success"
            round
            @click="submitComment()"
          >确定</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  components: {},
  props: {
    comments: {
      type: Array,
      required: true
    },
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      copyComment: '',
      inputComment: '',
      showItemId: ''
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus', 'detail'])
  },
  created() {
    console.log(this.comments);
  },
  methods: {
    /**
     * 点赞
     */
    // likeClick(item) {
    //   if (item.isLike === null) {
    //     Vue.$set(item, 'isLike', true);
    //     item.likeNum++;
    //   } else {
    //     if (item.isLike) {
    //       item.likeNum--;
    //     } else {
    //       item.likeNum++;
    //     }
    //     item.isLike = !item.isLike;
    //   }
    // },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = '';
    },
    submitComment(item) {
      if (this.inputComment === this.copyComment) {
        this.$message('请输入评论');
        return;
      }
      this.inputComment = this.inputComment.substring(this.copyComment.length);
      let data = {
        commentAppType: 'illusts',
        commentAppId: this.pid,
        parentId: item && item.id || 0, // 父级评论id,顶级就是0
        replyTo: item && item.replyFrom || 0, // 回复者，没有就是0
        replyFromName: this.user.username, // 评论者用户名
        replyToName: item && item.replyFromName || '', // 回复者用户名
        content: this.inputComment// 内容
      };
      data = Object.assign(data, this.replyParam);
      this.$api.comment.makeComments(data)
        .then(res => {
          if (res.status === 200) {
            const params = { ...data, createDate: new Date(), replyFrom: this.user.id };
            if (params.parentId === 0) {
              this.comments.push(params);
            } else {
              const item = this.comments.find(item => item.id === params.parentId);
              if (item.subCommentList) {
                item.subCommentList.push(params);
              } else {
                item.subCommentList = [params];
              }
            }
            this.cancel();
            this.inputComment = '';
          }
        });
    },
    /**
     * 提交评论
     */
    commitComment() {
      console.log(this.inputComment);
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      if (reply) {
        this.copyComment = '@' + item.replyFromName + ' ';
        this.inputComment = '@' + item.replyFromName + ' ';
        this.showItemId = item.id;
      } else {
        this.copyComment = '';
        this.inputComment = '';
        this.showItemId = 'new';
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "@/assets/css/color.less";
.container {
  padding: 0 10px;
  box-sizing: border-box;
  .write-reply {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @text-minor;
    padding: 10px;
    cursor: pointer;
    &:hover {
      color: @text-main;
    }
    .el-icon-edit {
      margin-right: 5px;
    }
  }
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid @border-fourth;
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: @text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date {
          font-size: 12px;
          color: @text-minor;
        }
      }
    }
    .content {
      font-size: 16px;
      color: @text-main;
      line-height: 20px;
      padding: 10px 0;
    }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: @text-minor;
      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active,
        &:hover {
          color: @color-main;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: @text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    .reply {
      margin: 10px 44px;
      border-left: 2px solid @border-first;
      .comment-item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed @border-third;
        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: @text-main;
          .from-name {
            color: @color-main;
          }
          .to-name {
            color: @color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: @text-minor;
          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: @text-333;
            }
            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }
      .fade-enter-active,
      fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
    }
  }
  .input-wrapper {
    padding: 10px;
    // .gray-bg-input,
    // .el-input__inner {
    //   /*background-color: #67C23A;*/
    // }
    .btn-control {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 10px;
      .cancel {
        font-size: 16px;
        color: @text-normal;
        margin-right: 20px;
        cursor: pointer;
        &:hover {
          color: @text-333;
        }
      }
      .confirm {
        font-size: 16px;
      }
    }
  }
}
</style>
