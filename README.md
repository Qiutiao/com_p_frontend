# com_pixiv

## Project setup
```
npm install
npm run serve
```
一把梭

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目构成
该项目主要由：框体，首页，画作详情，画师主页，搜索结果，登陆注册 构成

### 框体
侧边栏(@/components/PublicComponents/LeftSide)，
标头(@/componencts/PublicComponents/Header)，
登录注册对话框(@/components/PublicComponents/Login/index)，
应用主体(由Vue-router重定向至 @/views/DailyRank/DailyRank)

### 首页
画作排行(@/views/DailyRank/DailyRank){
    无限滚动列表(@/components/Virtual-List/VirtualList){
        无限滚动列表加载(@/components/Collection/VirtualCollection)
        画作个体(@/components/Virtual-List/Item){
            收藏(@/components/Like/Like)
        }
    }
}

### 画像详情
画作详情(@/views/Detail/Detail){
    画作评论(@/components/PublicComponents/Comment)
    画师画作列表(@/components/Virtual-List/MyItem){
        收藏(@/components/Like/Like)
    }
}

### 画师主页
画师主页(@/views/Artist/Artist){
    无限滚动列表(@/components/Virtual-List/VirtualList){
        无限滚动列表加载(@/components/Collection/VirtualCollection)
        画作个体(@/components/Virtual-List/Item){
            收藏(@/components/Like/Like)
        }
    }
}

### 搜索结果
搜索结果(@/views/SearchResult/SearchResult){
    标签(@/components/PublicComponents/Tags)
    无限滚动列表(@/components/Virtual-List/VirtualList){
        无限滚动列表加载(@/components/Collection/VirtualCollection)
        画作个体(@/components/Virtual-List/Item){
            收藏(@/components/Like/Like)
        }
    }
}

### 登录注册
是否已登录
 ? 用户{
     已收藏的画作(@/views/BookMarked/index){
        无限滚动列表(@/components/Virtual-List/VirtualList){
            无限滚动列表加载(@/components/Collection/VirtualCollection)
            画作个体(@/components/Virtual-List/Item){
                收藏(@/components/Like/Like)
            }
        }
     }
     已关注的画师(@/views/Followed/index)
 }
 : 登录注册对话框(@/components/PublicComponents/Login/index){
    登录(@/components/PublicComponents/Login/Login)
    注册(@/components/PublicComponents/Login/Register)
 }
