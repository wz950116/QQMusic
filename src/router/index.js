import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
	{
		path: "/home",
		name: "home",
		// 实现路由按需加载
		component: resolve => require(["views/home/index"], resolve)
	},
	{
		path: "/singerList",
		name: "singerList",
		component: resolve => require(["views/musicList/singerList"], resolve)
	},
	{
		path: "/topList",
		name: "topList",
		component: resolve => require(["views/musicList/topList"], resolve)
	},
	{
		path: "/radio",
		name: "radio",
		component: resolve => require(["views/musicList/radio"], resolve)
	},
	{
		path: "/rankList/:id",
		name: "rankList",
		component: resolve => require(["components/rankList"], resolve)
	},
	{
		path: '/playing',
		name: 'playing',
		meta: {
			noPageAnimation: true
		},
		beforeEnter(to, from, next) {
			// store.state.playing.songlist.length > 0 && next();
		},
		component: resolve => require([
			"components/playing"], resolve)
	},
	{
		path: "*",
		redirect: "/home"
	}
]

export default new Router({
	routes,
	mode: "history",  // 不用hash值
	base: "/base"
})
