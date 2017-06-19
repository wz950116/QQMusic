<template>
	<div class="page playing-container">
		<!-- 头部 -->
		<transition appear :css="false" @enter="_bounceDown">
			<mt-header 
				fixed
				:title="songMsg.data.songname"
				class="music-header-3 playing-header">
				<span slot="left" @click="$router.go(-1)">
					<img src="../../assets/arrow-down.png" width="26">
				</span>
				<span slot="right" class="songMore">...</span>
			</mt-header>
		</transition>
		<!-- 内容 -->
		<div class="content-wrapper">
			<!-- main部分 -->
			<slider>
				<div class="ablum-wrapper">
					<transition :css="false" @enter="_bounceDown" appear>
						<div class="title-wrap">
							<p>
								<img src="../../assets/horizontal.png" width="18">
								<router-link 
									tag="span"
									to=""
									style="vertical-align: middle">
									&nbsp;{{songMsg.data.singer[0].name}}&nbsp;
								</router-link>
								<img src="../../assets/horizontal.png" width="18">
							</p>
						</div>
					</transition>
					<img 
						:src="ablumImgUrl"
						:class="['ablum', {'spin': this.songState.playingState != 'pause'}]">
					<p class="lyric">
						{{currentLyric}}
					</p>
				</div>
				<lyrics slot="right"></lyrics>
			</slider>
			<!-- controll部分 -->
			<transition appear :css="false" @enter="_bounceUp">
				<div class="play-wrapper">
					<div class="timer">
						<span>{{playingCurrent | timeFormat}}</span>
						<div class="progress" ref="progress">
							<div class="progress-bar" :style="{width: playingPrgress*100 + '%'}"></div>
								<span 
									class="progress-ball"
					    		  	:style="{left: playingPrgress*100 + '%'}">
								</span>
						</div>
						<span class="endTime">{{playTiming | timeFormat}}</span>
					</div>
					<div class="play-control">
						<img 
							:src="require(`@/assets/${playOrder}.png`)" 
							@click="switchPlayOrder"
							class="order-icon"/>
						<img 
							src="../../assets/back.png" 
							@click='playSong("prev")'
							class="back-icon" />
						<img 
							:src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-2':'pause-2'}.png`)"
							class="play-icon" />
						<img 
							src="../../assets/prev.png" 
							@click="playSong('next')"
							class="back-icon" />
						<img 
							src="../../assets/list.png" 
							@click="toggleShow"
							class="list-icon" />
					</div>
				</div>
			</transition>
		</div>
		<div class="bgimg-blur" :style="{backgroundImage: `url(${ablumImgUrl})`}"></div>
		<div class="overlay"></div>
	</div>
</template>

<script>
	import {mapState, mapMutations, mapActions} from "vuex"
	// 动画库
	import Velocity from "velocity-animate"
	const NameSpace = "playing"

	export default {
		name: "playing",
		data() {
			return {

			}
		},
		computed: {
			...mapState(NameSpace, ["songMsg", "songState"]),
			playingCurrent() {
				return this.songState.currentLyricCurrentTime
			},
			playTiming() {
				return this.songState.currentDuration
			},
			ablumImgUrl() {
				return this.songMsg.data.albummid ? (this.songMsg.songblum_prfix + this.songMsg.data.albummid + '.jpg?max_age=2592000') : 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6'
			},
			// 歌词当前句
			currentLyric() {
				return this.songState.currentLyricArr[this.songState.currentLyricIndex];
			},
			playingPrgress() {
				return this.songState.playingProgress;
			},
			playOrder() {
				return this.songState.playingOrder;
			},
		},
		methods: {
			...mapMutations(NameSpace, ["pause", "switchPlayOrder", ]),
			...mapMutations("list", ["toggleShow"]),
			...mapActions(NameSpace, ["playSong"]),

			_bounceDown(el) {
				Velocity(el, {translateY: -800}, {duration: 0})
				Velocity(el, {translateY: [5, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400})
				Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100}).then(() => {el.removeAttribute('style')})
			},
			_bounceUp(el) {
				Velocity(el, {translateY: 800}, {duration: 0})
				Velocity(el, {translateY: [-20, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400})
				Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100})
			} 
		},
		components: {
			slider(resolve) {
				require(["components/slider.vue"], resolve)
			},
			lyrics(resolve) {
				require(["components/lyrics.vue"])
			}
		}
	}
</script>

<style lang="sass" scoped>
	.playing-container {
		overflow: hidden;
		z-index: 4;
		.songMore {
			font-size: 30px;
			font-weight: bold;
			display: inline-block;
			margin-top: -10px;
		}
		.bgimg-blur, .overlay {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			filter: blur(15px);
		}
		.bgimg-blur {
			z-index: -2;
			transform: scale(1.15);
			background-size: cover;
			background-position: bottom center;
		}
		.overlay {
			z-index: -1;
			background-color: rgba(0, 0, 0, .4);
		}
		.content-wrapper {
			display: flex;
			align-items: space-around;
			flex-wrap: wrap;
			margin-top: 2.4rem;
			height: 100%;
			.ablum-wrapper {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
			}
			.ablum-wrapper, .play-wrapper {
				flex-basis: 100%;
			}
			.play-wrapper {
				display: flex;
				flex-direction: column;
				justify-content: center;
				.endTime {
					padding-left: 6px;
				}
			}
		}
		.ablum-wrapper {
			.title-wrap {
				width: 100%;
				font-size: 14px;
				text-align: center;
				color: $white-base;
			}
			.ablum {
				@include img-responsive;
				@include center-auto;
				border-radius: 50%;
				border: 8px solid rgba(0, 0, 0, .3);
			}
			.lyric {
				width: 100%;
				height: 20px;
				color: $white-base;
				text-align: center;
				overflow: hidden;
			}
		}
		.play-control {
			display: flex;
			margin-top: 10px;
			padding: 0 20px;
			justify-content: space-between;
			align-items: center;
			.back-icon {
				width: 2rem;
				height: 2rem;
			}
			.play-icon {
				width: 3rem;
				height: 3rem;
			}
			.order-icon, {
				height: 1.5rem;
			}
			.list-icon {
				width: 1.25rem;
				height: 1.5rem;
			}
		}
	}
</style>