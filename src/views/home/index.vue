<template>
	<div class="page">
		<mt-header fixed 
				   title="音乐馆" 
				   class="music-header scroll-header" 
				   :style="searchVisible && {top: '-40px'}">
		</mt-header>
		<form @submit="searching">
			<home-search
				v-model="searchValue"
				:visible.sync="searchVisible"
				:style="searchVisible && {top: '-40px', height: '100%',height: '100vh'}">
				<div class="hotkey-wrapper">
					<p>热门搜索</p>
					<ul class="hotkey-list" ref="list">
						<template v-for="(item, index) in hotkeys.slice(0,10)">
						    <template v-if="index == 0">
						    	<li class="speical" @click="hotkeySearch(item.k,index)">{{item.k}}</li>
						    </template>
						    <template v-else>
						    	<li @click="hotkeySearch(item.k,index)">{{item.k}}</li>
						    </template>
					    </template>
					</ul>
				</div>
			</home-search>
		</form>
		<div class="page-content" style="margin-top:86px;">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide v-for="(item, index) in bannerDate" key="index">
					<img 
						:src="item.picUrl" 
						class="slider-item" 
						@click="goSpecial(item.linkUrl)">
				</swiper-slide>
				<div class="swiper-pagination"  slot="pagination"></div>
			</swiper>
			<ul class="radio-list">
				<li v-for="item in musiclist" @click="$router.push({name: item.route})">
					<img class="icon" :src="require(`../../assets/${item.icon}`)">
					<span class="name">{{ item.name }}</span>
				</li>
			</ul>
			<div class="recommend-wrapper">
				<p class="title">热 门 推 荐</p>
				<ul class="recommend-list">
					<!-- API出错！ -->
					<!-- <router-link v-for="(item, index) in indexMsg.songList"
								 tag="li"
								 key="index"
								 :to="{ name: 'recommend', params: {id: item.id}}">
						<div class="cover-wrapper">
							<img :src="item.picUrl">
							<span class="listen-count">
								<i class="listen-icon"></i>
								{{ item.accessnum | listenFormat }}万
							</span>
							<i class="listen-play"></i>
						</div>
						<span class="song-desc">{{ item.songListDesc }}</span>
					</router-link> -->
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import {apiHandler} from '@/api/index'
	import {dealHotkey} from "@/public/index"
	import homeSearch from "components/search"
	import {swiper, swiperSlide} from 'vue-awesome-swiper'
	export default {
		name: "home",
		data (){
			return {
				indexMsg: {},
				searchVisible: false, 
				searchValue: "",
				searchState: 0, 
				searchResult: [],
				hotkeys: [],
				musiclist: [
					{
						icon: 'people.png',
						name: '歌手',
						route: 'singerList'
					},
					{
						icon: 'rank.png',
						name: '排行',
						route: 'topList'
					},
					{
						icon: 'radio.png',
						name: '电台',
						route: 'radio'
					}
				],
				swiperOption: {
		          	autoplay: 5000,
		          	initialSlide: 1,
		          	loop: true,
		          	pagination: '.swiper-pagination'
		        }
			};
		},
		components: {
			homeSearch, swiper, swiperSlide
		},
		computed: {
			bannerDate() {
				return this.indexMsg && this.indexMsg.slider;
			}
		},
		// 实例已经创建完成之后请求搜索数据
		created (){
			apiHandler("indexMsg", response=>{
				response.data && (this.indexMsg = response.data);
			});
			// 热搜数据 对象转换成数组
			apiHandler("hotkey", response=>{
				this.hotkeys = dealHotkey(response.data);
			});
		},
		methods: {
			hotkeySearch(hotkey,index) {
				let olist = this.$refs.list.children;
				for(var i=0;i<olist.length;i++){
					olist[i].className = "";
				}
				olist[index].className = "speical";
				this.searchValue = hotkey;
				this.searching();
			},
			searching (e){
				// 阻止默认事件
				e && e.preventDefault();
				this.searchState = 1;
				apiHandler({
					name: 'search',
					params: {
		        		key: this.searchValue
		        	}
				}, response => {
					console.log(response);
					// API出错！
					this.searchState = 2;
					this.searchResult = response.data && response.data.song.itemlist || [];
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-header {
		transition: top .5s ease;
	}
	.swiper-container {
		z-index: 0;
		.slider-item {
			@include img-responsive;
		}
		.swiper-pagination-bullet-active {
			background: $white-base;
		}
	}
	.hotkey-wrapper {
		padding: 15px;	
		p:first-child {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.5);
			margin-bottom: 10px
		}
		.hotkey-list {
			display: flex;
			flex-wrap: wrap;
			> li {
				font-size: 14px;
				margin-right: 5px;
				margin-bottom: 10px;
				text-align: center;
				padding: 0 10px;
			    height: 30px;
			    line-height: 30px;
				border-radius: 16px;
				border: 1px solid $base-line-color;
				&.speical {
					border-color: $primary-color;
					color: $primary-color;
				}
			}
		}
	}
	.radio-list {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		> li {
			display: flex;
			flex: 1;
			justify-content: center;
		    align-items: center;
			.icon {
				display: inline-block;
				width: 30px;
				height: 30px;
				margin-right: 10px;
			}
			.name {
				font-size: 14px;
			}
		}
	}
	.recommend-wrapper {
		.title {
			text-align: center;
			line-height: 48px;
			font-size: 20px;
		}
		.recommend-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			> li {
				flex-basis: 33%;
				.cover-wrapper {
					position: relative;
					.listen-count {
						position: absolute;
					    top: 100%;
					    margin-top: -16px;
					    font-size: 10px;
					    color: #fff;
					    .listen-icon {
					    	    display: inline-block;
							    width: 10px;
							    height: 10px;
							    margin-left: 3px;
							    margin-right: 3px;
							    background-position: 0 -50px;
							    background-image: url(https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png?max_age=19830212&d=20151105145423);
							    background-repeat: no-repeat;
							    background-size: 24px 60px;
					    }
					}
					.listen-play {
				    	    position: absolute;
						    top: 100%;
						    right: 5px;
						    width: 24px;
						    height: 24px;
						    margin-top: -28px;
						    background: url('https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/list_sprite.png?max_age=19830212&d=20151105145423');
						    background-repeat: no-repeat;
						    background-size: 24px 60px;
				    }
					img {
						@include img-responsive;
					}
				}
				.song-desc {
					display: block;
					padding: 5px;
					font-size: 12px;
					line-height: 1.2;
					height: 40px;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>