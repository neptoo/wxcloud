var postsData = require('../../data/posts-data.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({ postList: postsData.postList });
    },
    onPostTap: function(event){
        var postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url:"post-detail/post-detail?id=" + postId
        })
    },
    onSwiperTap:function(event){
        // 断点调试查看是否有postid
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url:"post-detail/post-detail?id=" + postId
        })
    }
})