import axios from '../base';
import dayjs from 'dayjs';

function format(param) {
  return encodeURIComponent(param).replace('%2F', '/');
}

function getKeyword(param) {
  return axios({
    url: `/keywords/${format(param)}/candidates`,
    method: 'get'
  });
}

function getSearch(params) {
  return axios({
    url: `/illustrations`,
    method: 'get',
    params: {
      ...params,
      pageSize: 30
    }
  });
}

// 获取该搜索词相关联的tag
function getTags(param) {
  return axios({
    url: `/keywords/${format(param)}/pixivSuggestions`,
    method: 'get'
  });
}

// 获取该搜索词的专属词条（往往是一些词汇所对应的acg作品名称）
function getExclusive(param) {
  return axios({
    url: `/keywords/${format(param)}/suggestions`,
    method: 'get'
  });
}

function getTranslations(param) {
  return axios({
    url: `/keywords/${format(param)}/translations`,
    method: 'get'
  });
}

// 图片上传
function uploadImg(data, params) {
  return axios({
    url: `https://pic.cheerfun.dev/upload?isTemp=${!params}`,
    method: 'post',
    data,
    params
  });
}

// 以图搜图
function searchByImg(imageUrl) {
  return axios({
    url: `/similarityImages?imageUrl=${imageUrl}`,
    method: 'get'
  });
}

// 获取存在信息
function getExists(param) {
  return axios({
    url: `/exists/${param.type}/${param.id}`,
    method: 'get'
  });
}

// 查看热门搜索标签
function getHotTag(params) {
  return axios({
    url: `/trendingTags`,
    method: 'get',
    params: params || { date: dayjs(new Date()).format('YYYY-MM-DD') }
  });
}

export {
  getSearch,
  getTags,
  getKeyword,
  getTranslations,
  getExclusive,
  uploadImg,
  searchByImg,
  getExists,
  getHotTag
};
