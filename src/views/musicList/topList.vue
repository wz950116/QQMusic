<template>
	<div class="page">
		<mt-header fixed title="排行榜" class="music-header">
			<!-- slot="left" 规范 保留显示返回icon -->
			<go-back slot="left"></go-back>
		</mt-header>
		<div class="page-content">
			<ul class="music-list">
				<li style="margin:0">
					<mt-cell title="Q Q 音 乐 巅 峰 榜"  class="music-cell-type1">
					</mt-cell>
				</li>
				<template v-for="item in getListData">
					<!-- 跳转至rankList页 携带id参数渲染不同数据 -->
					<router-link
						tag="li"
						:to="{name: 'rankList', params: {id: item.id}}"
						key="item.id">
						<!-- mt-cell === a标签 内嵌3个子DIV 中间DIV存放内容 -->
						<mt-cell  class="music-cell-type2">
							<!-- 左侧封面 -->
							<div class="listen-cover">
								<!-- 懒加载图片 -->
	              				<img v-lazy="item.picUrl">
	              				<span class="listen-count">
	                				<i class="listen-icon"></i>
	                				<!-- listenFormat过滤方法 -->
	                				{{ item.listenCount | listenFormat }}万
	              				</span>
	              				<i class="listen-play"></i>
	           				</div>
	           				<ul slot="title" class="song-list">
              					<li v-for="(i, index) in item.songList" key="index" class="song-item"> 
	                				{{ index+1 }}&nbsp;{{ i.songname}}
	                				<span class="song-singer">
	                					{{ '- '+i.singername }}
	                				</span>
              					</li>
            				</ul>
						</mt-cell  class="music-cell-type2">
					</router-link>	
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
	import { apiHandler } from '@/api/index';
	export default {
		name: "topList",
		data() {
			return {
				topList: {}
			}
		},
		created() {
			apiHandler("topList", response=>{
				this.topList = response.data.topList
			})
		},
		computed: {
			getListData() {
				return this.topList
			}
		}
	}
</script>

<style lang="scss" scoped>
	.music-list {
		> li {
			margin: 0 10px 10px;
		}
	}
</style>