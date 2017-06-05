import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入mint-ui框架  （可以按需引入部分组件及样式）
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
//引入公共资源 （过滤器）
import "@/public/filter.js"

// 全局样式
import './sass/index.scss';
import './sass/themes/default.scss';

// 全局方法
import playMusic from "./public/mixin.js"
Vue.prototype.play = playMusic

Vue.use(Mint);

// 对于常用组件全局注册
Vue.component('goBack', resolve => resolve(require('components/goBack.vue')));

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");