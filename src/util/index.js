import * as dom from './dom';
import axios from 'axios';
import { COLOR_LIST } from './constants';

export default {
  dom
};

export function download(href, cb) {
  const eleLink = document.createElement('a');
  eleLink.download = '';
  eleLink.href = href;
  eleLink.click();
  eleLink.remove();
  cb && cb();
}

export function downloadImage(url, cb) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      onDownloadProgress(progress) {
        cb && cb(progress);
      }
    })
      .then(res => {
        const url = URL.createObjectURL(res.data);
        download(url);
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

let last = 0;
export function randomColor() {
  last =
    (last + Math.round((Math.random() * COLOR_LIST.length) / 2 + 1)) %
    COLOR_LIST.length;
  return COLOR_LIST[last];
}

export function debounceAsyncValidator(validator, delay) {
  let currentTimer = null;
  let currentPromiseReject = null;

  function debounce() {
    return new Promise((resolve, reject) => {
      currentTimer = setTimeout(() => {
        currentTimer = null;
        currentPromiseReject = null;
        resolve();
      }, delay);
      currentPromiseReject = reject;
    });
  }

  return function(value) {
    if (currentTimer) {
      currentPromiseReject(new Error('replaced'));
      clearTimeout(currentTimer);
      currentTimer = null;
    }

    return validator.call(this, value, debounce);
  };
}

export function replaceBigImg(url) {
  return url.replace('_webp', '').replace('i.pximg.net', 'original.img.cheerfun.dev');
}

export function replaceSmallImg(url) {
  return url.replace('i.pximg.net', 'img.cheerfun.dev:233');
}
