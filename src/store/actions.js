import * as types from './mutation-types';
import { collectIllust, deleteCollect, followArtist } from '@/api/modules/user';

export const setUser = ({
  commit
}, user) => {
  commit(types.SET_USER, user);
};

export const clearCurrentState = ({
  commit
}) => {
  localStorage.removeItem('user');
  commit(types.SET_USER, null);
};

export const changeTab = ({
  commit
}, flag) => {
  commit(types.SHOW_TAB, flag);
};

// 收藏画作
export const handleCollectIllust = ({
  commit
}, data) => {
  return new Promise((resolve, reject) => {
    collectIllust(data)
      .then(res => {
        if (res.status === 200) {
          const status = {
            illustId: data.illustId,
            like: true
          };
          commit(types.SET_LIKE_STATUS, status);
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 取消收藏
export const deleteCollectIllust = ({
  commit
}, data) => {
  return new Promise((resolve, reject) => {
    deleteCollect(data)
      .then(res => {
        if (res.status === 200) {
          const status = {
            illustId: data.illustId,
            like: false
          };
          commit(types.SET_LIKE_STATUS, status);
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 关注画师
export const handleFollowArtist = ({
  commit
}, data) => {
  return new Promise((resolve, reject) => {
    followArtist(data)
      .then(res => {
        if (res.status === 200) {
          const status = {
            artistId: data.artistId,
            follow: data.follow
          };
          commit(types.SET_FOLLOW_STATUS, status);
          resolve();
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const setDetail = ({
  commit
}, data) => {
  commit(types.SET_DETAIL, data);
};
export const setLoginBoolean = ({ commit }) => {
  commit(types.SET_Login_Boolean);
};
