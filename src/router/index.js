import Vue from 'vue'
import Router from 'vue-router'
import Home from "views/home/index"
import SingerList from "views/musicList/singerList"
import TopList from "views/musicList/topList"
import Radio from "views/musicList/radio"
import RankList from "components/rankList"

Vue.use(Router)

let routes = [
	{
		path: "/home",
		name: "home",
		component: Home
	},
	{
		path: "/singerList",
		name: "singerList",
		component: SingerList
	},
	{
		path: "/topList",
		name: "topList",
		component: TopList
	},
	{
		path: "/radio",
		name: "radio",
		component: Radio
	},
	{
		path: "/rankList/:id",
		name: "rankList",
		component: RankList
	},
	{
		path: "*",
		redirect: "/home"
	}
]

export default new Router({
	routes,
	mode: "history",  // 去除地址栏的 "#/"
	base: "/base"
})
