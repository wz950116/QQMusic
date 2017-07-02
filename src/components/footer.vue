<template>
	<div class="fixed-wrapper">
		<mt-cell class="music-cell-song-fixed">
			<router-link
				tag="div"
				class="song-cover"
				:to="{name: 'playing'}">
				<img :src="ablumImgUrl" :class="['song-album-img', playingState != 'pause' ? 'spin-slow' : 'spin-stop']">
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
			            :src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-small' : 'pause'}.png`)"
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
					lyricsArr: [],
					timeArr: [],
					durationArr: []
				},
				currentLyric: "",
			}
		},
		computed: {
			...mapState(NameSpace, ["songMsg", "songState"]),
			playingSongid () {
				return this.songMsg.data.songid && this.songMsg.data.songid;
			},
			playingState () {
				return this.songState.playingState;
			},
			ablumImgUrl () {
				return this.songMsg.data.albummid ? (this.songMsg.songblum_prfix + this.songMsg.data.albummid + '.jpg?max_age=2592000') : 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6'
			},
			playingProgress () {
				return this.songState.playingProgress;
			},
			currentTime () {
				return this.songState.currentLyricCurrentTime;
			}
		},
		watch: {
			// 当vuex中歌曲id发生改变重新发送请求获取歌词
			playingSongid(value) {
				jsonp({
					url: `https://api.darlin.me/music/lyric/${value}/?callback=jsonp1`,
					jsonpCallback: 'jsonp1'
				}, reponse => {
					// 歌词格式转换
					let lyrics = utf8.decode(base64.decode(reponse.lyric));
					// 歌词信息分解
					this.lyricsObj = lyricsAnalysis(lyrics);
					// 纯歌词保存至vuex
					this.switchLyricsArr(this.lyricsObj.lyricsArr);
				})
			},
			playingState(state) {
				// 用状态+对应歌曲id来监听变化 判断是否播放
				let audio = this.$refs.audio;
				if(state == "pause") {
					audio.pause();
				} else {
					// DOM更新完毕后播放
					this.$nextTick(() => {
						audio.play().catch(e => {
							// 若播放失败则暂停
							this.pause("pause");
							alert("网络故障...");
						})
					});
				}
			},
			currentTime(time) {
				let timeArr = this.lyricsObj.timeArr,
					lyricsArr = this.lyricsObj.lyricsArr,
					durationArr = this.lyricsObj.durationArr;
				timeArr.forEach((item, index) => {
					// 当前播放时间匹配歌词对应时间
					if(parseInt(time) == item) {
						this.currentLyric = lyricsArr[index];
						this.switchLyricsIndex(index);
						this.switchLyricsDuration(durationArr[index]);
					}
				})
			}
		},
		methods: {
			...mapMutations(NameSpace, ["pause", "switchLyricsArr", "switchLyricsIndex", "switchLyricsCurrentTime", "switchLyricsDuration"]),
			// 隐藏vuex中list模块对应的视图显示隐藏
			...mapMutations("list", ["toggleShow"]),
			...mapActions(NameSpace, ["playSong", "progressStart"]),
			_playProgress () {
				let audio = this.$refs.audio,
					currentTime = audio.currentTime,
					duration = audio.duration,
					progressObj = {currentTime, duration};
				this.progressStart(progressObj);
			}
		}
	}
</script>

<style lang="sass">
	.fixed-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		overflow: hidden;
		.mint-cell-value{
			width:100% !important;
			overflow: hidden !important;
			.song-cover {
				display: flex;
				flex: 1 1 auto;
				align-items: center;
				height: 56px;
				overflow: hidden;
				.name-desc {
					flex:1 1 auto;
					overflow: hidden;
					font-size: 14px;
					margin-left: 10px;
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
					width: 45px;
					height: 45px;
					border-radius: 50%;
				}
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
	}
</style>