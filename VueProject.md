# 坑

> 管理系统

* i18n
* icon
* bug 页面首次加载无法获取本地cookie
* 进不去home页
* input的ref导致this.$refs影响相邻其他组件的input输入
* return 不能放入循环内
* axios-mock-adapter
* config/index.js  配置proxyTable
* table
* 刷新页面如何不返回主页


>QQ音乐

* 子组件不建议修改副组建通过props传递过来的值  如果是基本数据类型会报错

* <Img :src="require(`../../assets/${item.icon}`)" />

* // 移除script标签

      window[callbackName] = function(data) {
      	window[callbackName] = undefined; //必须手动赋值undefined
          document.body.removeChild(script);
          callback(data);
      };

* 全局引入sass样式

* swiper配置问题

* 如何获取子组件input中的value值：监听变化，$emit("input",this.val)

* width:100vw  height:100vh  占满视图窗口

* Uncaught TypeError: Cannot convert undefined or null to object  请求轮播图数据，偶尔会抛出该错误

* ...mapX  是vuex对外暴露的四个方法 computed中获取getter、state

* ```
  <svg class="progress-circle" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
    <circle 
    class="progress-circle-prog" 
    cx="12" 
    cy="12" 
    r="11.1" 
    ref="progress"
    :style="{strokeDasharray: playingPrgress*70+ ', 70'}">
    </circle>
  </svg>
  ```

* 懒加载路由、图片等

* watch监听computed中的计算属性（获取vuex中的状态），通过jsonp获取所有歌曲信息，状态进度，媒体资源等

* 当vuex中songid发生改变重新发送请求

* 当点击相同歌曲或者不同歌曲是否触发watch来改变播放状态的判断：状态+“id”

* 因为的播放play()一定要在$nextTick（更新DOM）之后！

* @timeupdate控制一切的改变！！！！

* svg实现环形进度条


  ```
  <svg class="progress-circle" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
    <circle 
      class="progress-circle-prog" 
      cx="12" 
      cy="12" 
      r="11.1" 
      ref="progress"
      :style="{strokeDasharray: playingProgress*70+ ', 70'}">
    </circle>
  </svg>

  .progress-circle-prog {
    fill: none;
    stroke: $primary-color;
    stroke-width: 2px;
    stroke-dasharray: 0, 70;
    transition: stroke-dasharray 0.7s linear 0s;
  } 
  ```

* footer部分 滑动切换歌曲 待完善
* 样式的一些小BUG
* slot保留原有父组件部分，添加name值保留制定原有父组件部分
* 可以通过mapState获取状态，也可以定义getter获取
* 如何让歌曲自动切换到下一首？index++  监听？
* 修改element-ui某些样式不能给style标签加scoped