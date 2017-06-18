<template>
	<div class='page'>
		<v-header
			fixed 
			style="z-index:999"
			class="music-header-2" 
			:title="topinfo.ListName + `第${_getDayOfYear(data.update_time)}天`"
			:showTitle="showTitle">
			<go-back slot="left"></go-back>
			<span slot="right" class="more">
				...
			</span>
		</v-header>
		<div class="page-content" style="margin-top:0;overflow:hidden;">
			<div class="music-cover-wrap">
				<div 
					class="music-cover" 
		    	 	ref="musicCover"
		    	 	:style="{backgroundImage:`url(${topinfo.pic_album})`}"> 
		    	</div>
		    	<div class="title-wrap">
		    	 	<p class="main-title" v-if="topinfo.ListName">
		    	 		{{ topinfo.ListName }} 
		    	 		第{{ data.update_time | getDayOfYear }}天
		    	 	</p>
		    	 	<p class="minor-title" v-if="data.update_time">
		    	 		{{ data.update_time }}更新
		    	 	</p>
		    	</div>
		    	<div class="cover-overlay"></div>
			</div>
			<div 
				class="song-cotainer" 
				v-if="songlist.length" 
				ref="scrollTarget">
				<!-- 内置input事件 获取点击标签的id作为形参 -->
    			<mt-navbar 
    				class="nav-bar"
    				:value="selected" 
    				@input="value => {selected = value}">
				  	<mt-tab-item id="1">单曲</mt-tab-item>
				  	<mt-tab-item id="2">详情</mt-tab-item>
				</mt-navbar>
				<!-- selected控制显示的子级 -->
				<mt-tab-container 
					v-model="selected" 
					ref="scrollTouch"
					:class="{initHeight: !showTitle, changeHeight: showTitle}">
					<mt-tab-container-item id="1">
						<ul>
							<li>
								<mt-cell class="music-cell-type4">
									<a @click="randomPlayAll">
										<img src="../assets/play.png" class="icon" >随机播放全部
									</a>
								</mt-cell>
							</li>
							<li
								v-for="(song, index) in songlist" 
								key="index"
							    @click="toPlay(song.data, songlist, index)">
								<mt-cell class="music-cell-type3">
									<div class="suffix">
										<p :style="index<3 && {color: '#FF4500'}">
											{{ index + 1}}
										</p>
										<p>
											<span 
												class="icon" 
												:style="{backgroundImage: `url('/static/value-up.png')`}">
											</span>
											{{ song.in_count | convertListenCount }}
										</p>
									</div>
									<div class="song">
										<p>{{ song.data.songname }}</p>
										<p>{{ song.data.singer | spliceSinger }} · {{ song.data.albumname }}</p>
									</div>
									<span class="detail">···</span>
								</mt-cell>
							</li>
						</ul>
					</mt-tab-container-item>
					<mt-tab-container-item id="2">
						<p v-html="topinfo.info" class="music-info"></p>
					</mt-tab-container-item>
				</mt-tab-container>
	    	</div>
	    	<div class="ranklist-loading" v-else>
	    		<div class="loading">
	    			<!-- 加载动画标签 -->
	    			<mt-spinner type="fading-circle"></mt-spinner>
	    			<p>正在载入...</p>
	    		</div>
	    	</div>
		</div>
	</div>
</template>

<script>
	import {apiHandler} from '@/api/index'
	// 全屏滚动插件
	import AlloyTouch from 'alloytouch'
	import Transform from 'css3transform'
	import { lyricsAnalysis, getDayOfYear } from '../public'
	import { mapActions, mapGetters, mapMutations } from 'vuex'
	const NameSpace = 'playing'

	export default {
		name: "rankList",
		data() {
			return {
				data: {},
				topinfo: {},
				songlist: [],
				showTitle: false,
				title: '',
				selected: "1",
				coverScale: 1
			}
		},
		components: {
			vHeader(resolve) {
				require(['./header.vue'], resolve);
			}
		},
		computed: {
			...mapGetters({
				show: 'list_show',
			})
		},
		created() {
			// 歌曲列表数据请求 不同参数返回不同列表
	        apiHandler({
	        	name: 'rankList',
	        	params: {
	        		topid: this.$route.params.id
	        	}
	        }, response => {
	        	/*
	        	 * 延迟400ms执行等待页面切换动画完成
	        	 * 原由: 当不存在延迟时组件的内容渲染与页面的切换将会同时执行
	        	 * 由此将会导致在Chrome下产生卡顿
	        	 * 
	        	 * */
		        setTimeout(() => {
			        this.data = response;
		        	this.topinfo = response.topinfo;
			        this.songlist = response.songlist;

			        //DOM更新后调用全屏滚动事件
			        this.$nextTick(() => {
			        	this._initScroll();
			        });
		        }, 400);
	        })
		},
		methods: {
			_getDayOfYear: getDayOfYear,
			_initScroll() {
				let scrollTouch = this.$refs.scrollTouch.$el,
					scrollTarget = this.$refs.scrollTarget;
				Transform(scrollTarget, true);
				// 配置滚动条件
				let self = this;
				let alloyTouch = new AlloyTouch({
					touch: scrollTouch,  // 可触发滚动元素
					target: scrollTarget,  // 移动端的元素
					sensitivity: .5,  // 滚动时敏感度大小
					property: 'translateY',  // 平移方向
					max: 0,  // 初始位置最大值
					// 监听滚动事件
					change(pos) {
						let coverHeight = -scrollTouch.clientWidth*.6;
						// 滑动距离达到60 显示头部滚动条
						self.showTitle = pos <= -60 ? true : false;
						if (pos <= coverHeight) {
							// 当满足条件则固定高度
							this.target[this.property] = coverHeight;
							this.preventDefault = false;  // 解除默认事件
						}else {
							this.preventDefault = true;
						}
						// filter属性改变背景图模糊程度
						self.$refs.musicCover.style.WebkitFilter = `blur(${pos/coverHeight*20}px)`
					}
				});
			},
			/**
			 * mapState/mapGetters/mapMutations/mapActions
			 * 是vuex提供的四个方法 接受namespace（选填） map（必填）
			 * 返回一个对象
			 * ...map* 即获取队列追加到另外一个对象中
			 */
			...mapMutations(NameSpace, ["playSong", "pause", "songList", "songIndex", 'switchPlayOrder', 'stackSonglist']),

			randomPlayAll() {
				// this.stackSonglist(this.songlist)
				// this.switchPlayOrder('random')
				// this.playSong('next')
			},
			toPlay(data, dataList, index) {
				// 歌曲信息
				this.playSong(data)
				this.pause("play"+data.songid)
				// 歌曲列表
				this.songList(dataList)
				// 歌曲索引值
				this.songIndex(index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.more{
		font-size: 30px;
		font-weight: bold;
		display: inline-block;
		margin-top: -10px;
	}
	.initHeight{
		height: 30vh;
	}
	.changeHeight{
		height: 60vh;
		padding-bottom: 0 !important;
	}
	.music-cover-wrap {
		position: relative;
		width: 100%;
		overflow: hidden;
		margin-top:0;
		.music-cover {
			width: 100%;
			background-repeat: no-repeat;
			background-size: cover;
			transition: blur .3s ease;
			&:after {
				display: block;
				content: '';
				padding-top: 90%;
			}
		}
		.title-wrap {
			position: absolute;
			width: 100%;
			bottom: 8%;
			color: #ffffff;
			z-index: 3;
			.main-title, .minor-title {
				text-align: center;
				margin-top: 0;
				margin-bottom: 5px;
			}
			.main-title {
				font-size: 18px;
			}
			.minor-title {
				font-size: 14px;
			}
		}
		.cover-overlay {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, .7);
			z-index: 2;
		}
	}
	.song-cotainer, .ranklist-loading {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		background-color: transparent;
		overflow: hidden;
		z-index: 99;
		&::before {
			display: block;
			content: '';
			margin-top: 60vh;
		}
		.lyrics-wrapper {
			line-height: 42px;
			text-align: center;
			font-size: 16px;
		}
		.nav-bar{
			width: 100%;
			height: 10vh;
			z-index: 99;
		}
		.mint-tab-container{
			overflow: auto;
			padding-bottom: 56px;
			.mint-tab-container-wrap{
				.mint-tab-container-item{
					.music-info{
						color: rgba(0, 0, 0, .5); 
						padding: 15px;
						font-size: 14px;
						line-height: 22px;
					}
					.song{
						margin-left: 10px;
					}
				}
			}
		}
	}
	.ranklist-loading {
		bottom: 0;
		.loading {
			display: flex;
			justify-content: center;
			padding-top: 30%;
			height: 100%;
			background-color: $white-base;
			p {
				margin-top: 10px;
				margin-left: 10px;
				font-size: 10px;
				color: rgba(0, 0, 0, .5);
			}
		}
	}
</style>