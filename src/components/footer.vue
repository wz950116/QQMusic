<template>
	<div class="fixed-wrapper">
		<mt-cell class="music-cell-song-fixed">
			<router-link
				tag="div"
				class="song-cover"
				:to="{name: 'playing'}">
				<img :src="ablumImgUrl" :class="['song-album-img', 'name-desc', playingState != 'pause' ? 'spin-slow' : 'spin-stop']">
				<div class="name-desc">
					<p>{{ songMsg.data.songname }}</p>
					<p>{{ currentLyric || (songMsg.data.singer && songMsg.data.singer[0].name) }}</p>
				</div>
			</router-link>
			<div class="play-wrapper">
				<div class="circle-wrapper">
					<!-- svg圆形 -->
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
					<img 
			            :src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-small':'pause'}.png`)"
			            @click="pause(playingState == 'pause' ? '' : 'pause')"
						class="play-icon">
				</div>
				<img src="../assets/list-green.png" class="list-icon" @click="toggleShow">
			</div>
		</mt-cell>
		<audio :src="songMsg.getMedia(songMsg.data.songid)" ref="audio" @timeupdate="_playProgress">			
		</audio>
	</div>
</template>

<script>
	import store from "../store"
	import base64 from "base-64"
	import utf8 from "utf8"
	import {jsonp} from "@/api/index"
	import {mapState, mapMutations, mapActions} from "vuex"
	import {lyricsAnalysis} from "@/public/index"
	const NameSpace = "playing"

	export default {
		name: "play-fixed",
		data() {
			return {
				lyricsObj: {
					timeArr: [],
					lyricsArr: [],
					durationArr: []
				},
				currentLyric: "",

			}
		},
		computed: {
			...mapState(NameSpace, ["songMsg", "songState"]),
			playingSongid() {
				return this.songMsg.data.songid
			},
			ablumImgUrl() {
				return this.songMsg.data.albummid ? (this.songMsg.songblum_prfix + this.songMsg.data.albummid + '.jpg?max_age=2592000') : 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6'
			},
			playingState() {
				return this.songState.playingState
			},
			playingProgress() {
				return this.songState.playingProgress
			}
		},
		watch: {
			// 当vuex中歌曲id发生改变重新发送请求
			playingSongid(value) {
				jsonp({
					url: `https://api.darlin.me/music/lyric/${value}/?callback=jsonp1`,
					jsonpCallback: 'jsonp1'
				}, reponse => {
					// 歌词格式转换
					let lyrics = utf8.decode(base64.decode(reponse.lyric))
					// 歌词信息分解
					this.lyricsObj = lyricsAnalysis(lyrics)
					// 纯歌词保存至vuex
					this.switchLyricsArr(this.lyricsObj.lyricsArr)
				})
			},
			playingState(state) {
				// 用状态+对应歌曲id 判断是否播放
				let audio = this.$refs.audio
				if(state == "pause") {
					audio.pause()
				} else {
					// DOM更新后播放
					this.$nextTick(() => {
						audio.play().catch(e => {
							//若播放失败则提示并暂停
							alert("音乐加载失败")
							this.pause("pause")
						})
					});
				}
			}
		},
		methods: {
			...mapMutations(NameSpace, ["switchLyricsArr", "pause"]),
			// 隐藏vuex中list模块对应的视图显示影藏
			...mapMutations("list", ["toggleShow"]),
			...mapActions(NameSpace, ["playSong", "progressStart"]),
			_playProgress(e) {
				let audio = e.target,
					// 这边的currentTime duration的获取最好也放到vuex中通过computed获取来的准确有效
					currentTime = audio.currentTime,
					duration = audio.duration,
					progressObj = {currentTime, duration};
				this.progressStart(progressObj)
			}
		}
	}
</script>

<style lang="sass" scoped>
	.fixed-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		overflow: hidden;
		.song-cover {
			display: flex;
			flex: 1;
			align-items: center;
			height: 56px;
			overflow: hidden;
			.name-desc {
				overflow: hidden;
				font-size: 14px;
				p {
					@include font-ellipsis;
				}
				p:first-child {
					font-size: 14px;
					color: $black-base-font;
				}
				p:last-child {
					margin-top: 5px;
					color: $gray-light-font;
				}
			}
			.song-album-img {
				display: block;
				max-width: 100%;
				width: 45px;
				height: 45px;
				border-radius: 50%;
			}
		}
		.mint-cell-value {
			overflow: hidden;
		}
		.play-wrapper {
			display: flex;
			align-items: center;
			.circle-wrapper {
				position: relative;
			    width: 28px;
			    height: 28px;
			    border: 2px solid $primary-color;
			    border-radius: 50%;
				.progress-circle {
				    transform: rotate(-90deg);
				}
				.progress-circle-prog {
				    fill: none;
				    stroke: $primary-color;
				    stroke-width: 2px;
				    stroke-dasharray: 0, 70;
				    transition: stroke-dasharray 0.7s linear 0s;
				} 
				.play-icon {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					width: 16px;
				}
			}
			.list-icon {
				margin-left: 16px;
				width: 24px;
				height: 24px;	
			}
		}
	}
</style>