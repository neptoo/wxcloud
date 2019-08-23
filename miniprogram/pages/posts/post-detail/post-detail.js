var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        collected: false,
        isPlayingMusic: false
    },
    onLoad: function(option) {
        // var globalData=app.globalData;

        var postId = option.id;
        this.data.currentPostId = postId;
        // var postData = postsData.postList[postId]
        this.setData({ postData: postsData.postList[postId] });
        // get all posts stage
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            if(!postCollected){
              this.setData({
                collected: false
              })
            }else{
              this.setData({
                  collected: postCollected
              })
            }
            
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        this.setAudioMonitor();

    },
    setAudioMonitor: function() {
        // 通过事件 让框架调用自己的代码 数据绑定
        var that = this;
        wx.onBackgroundAudioPlay(function() {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function() {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function(event) {
        // 要加this!
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();
    },

    // 异步的获取postsCollected
    getPostsCollectedAsy: function() {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function(res) {
                var postsCollected = res.data;
                // var postCollected = postsCollected[this.data.currentPostId]; this获取错误
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变为未收藏，未收藏变为收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                // 加this才能访问到该方法
                that.showToast(postsCollected, postCollected);
            }
        })
    },
    // 同步
    getPostsCollectedSyc: function() {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变为未收藏，未收藏变为收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // 加this才能访问到该方法
        this.showToast(postsCollected, postCollected);
    },

    // postsCollected,postCollected在方法里未定义但要使用 所以要先获取传入
    showToast: function(postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量 从而实现图片切换
        this.setData({
            collected: postCollected
        })
        // 提示用户
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消收藏',
            duration: 1000
        })
    },
    onShareTap: function(event) {
        var itemList = ["分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function(res) {
                // res.cancel 用户是不是点击了取消
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "抱歉用户" + res.cancel + "暂时无法分享"
                })
            }
        })
    },
    onMusicTap: function(event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            // this.data.isPlayingMusic = false;
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }

})