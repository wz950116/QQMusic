<template>
	<div 
		class="lyrics-wrapper" 
		ref="lyricsWrapper">
		<div class="lyrics">
			<p 
				v-for="(item, key) in lyricsArr" 
			   	v-if="item"
			   	:class="key == lyricIndex && 'gradient'"
			   	:style="key == lyricIndex && lyricObj">
			   	{{item}}
			</p>
		</div>
	</div>
</template>

<script>
	import TWEEN from 'tween.js';
	import AlloyTouch from 'alloytouch';
	import Transform from 'css3transform';
	import {mapState, mapMutations} from 'vuex';
	const NameSpace = 'playing';

	export default {
		name: 'lyrics',
		mounted() {
			
		},
		data() {
			return {
				lyrics: {
					linearGradient: 0
				},
				alloyTouch: {},
				scroll: {},
				scrollAbled: true
			}
		},
		computed: {
			...mapState(NameSpace, ["songState"]),
			// 获取当前歌词
			lyricsArr() {
				return this.songState.currentLyricArr
			},
			// 获取当前歌曲的索引值
			lyricIndex() {
				return this.songState.currentLyricIndex
			},
			// 获取当前歌曲的总时长
			lyricDuration() {
				return this.songState.currentLyricDuration
			}
		},
		watch: {
			lyricIndex() {
				
			},
			lyricDuration(duration) {
				console.log(duration)
			}
		},
		methods: {
			
		}
	};
</script>

<style lang="sass" scoped>
	.lyrics-wrapper {
		position: relative;
		height: 100%;
		overflow: hidden;
		.lyrics {
			display: flex;
			align-items: center;
			flex-direction: column;
			.gradient {
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
			p {
				line-height: 42px;
				text-align: center;
				font-size: 16px;
				color: rgba(255,255,255,.8);
			}
		}
	}
</style>