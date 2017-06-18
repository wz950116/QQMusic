import {PLAY_SONG, PAUSE, MODIFY_PROGRESS, SWITCH_DURATION, SWITCH_LYRICS_ARR, SWITCH_LYRICS_INDEX, SWITCH_LYRICS_CURRENTTIME, SWITCH_LYRICS_DURATION, SONG_LIST, SONG_INDEX} from "../mutations_type.js";

const namespaced = true

const state = {  
	// 歌曲信息
	songMsg: {
		data: {
			songid: "",     // 歌曲ID
			songname: "",   // 歌曲名
			singer: "",     // 歌手
			albumname: "",  // 专辑名
			albummid: ""    // 专辑ID
		},
		// 专辑icon的baseURL
		songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000',
		// 音频URL
		getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
	},
	// 歌曲状态
	songState: {
		// pause or play+id or 空
		playingState: "pause",
		// 播放进度progress
		playingProgress: 0,
		// 当前歌词总时长
		currentDuration: 0,
		// 当前播放列表
		currentLyricArr: [],
		// 当前歌词索引值
		currentLyricIndex: "",
		// 当前时间
		currentLyricCurrentTime: 0,
		// 当前句歌词持续时间
		currentLyricDuration: "",
		// 当前歌曲索引值
		songIndex: "",
		// 播放规则
		playingOrder: 'cycle'
	},
	// 播放列表
	songList: []
}

const mutations = {
	// 歌曲ID
	[PLAY_SONG](state, data) {
		let newIndex,
			songIndex = state.songState.songIndex,
			length = state.songList;
		if(typeof data == "string") {
			switch (data) {
				case "next":
					newIndex = songIndex >= length-1 ? 0 : ++songIndex;
					break;
				case "prev":
					newIndex = songIndex <= 0 ? songIndex[length-1] : --songIndex;
					break;
				default:
					break;
			}
		}else {
			state.songMsg.data.songid = data.songid || ""
			state.songMsg.data.songname = data.songname  || ""
			state.songMsg.data.singer = data.singer  || []
			state.songMsg.data.albumname = data.albumname || ""
			state.songMsg.data.albummid = data.albummid || ""
		}
		console.log(data);
		let songMsg =  state.songList[newIndex];
		state.songState.currentIndex = newIndex;
		state.songMsg = {...state.songMsg, ...songMsg};  // 合并当前歌曲信息
		console.log(songMsg)
		console.log(state.songState.currentIndex)
		console.log(state.songMsg)
		// dispatch('progressStart');
	},
	// 暂停 播放
	[PAUSE](state, musicState) {
		state.songState.playingState = musicState
	},
	// 进度
	[MODIFY_PROGRESS](state, newProgress) {
		state.songState.playingProgress = newProgress
	},
	// 总时长
	[SWITCH_DURATION](state, duration) {
		state.songState.currentDuration = duration
	},
	// 歌词
	[SWITCH_LYRICS_ARR](state, arr) {
		// 判断传入是否为数组
		state.songState.currentLyricArr = arr instanceof Array ? arr : []
	},
	// 当前句索引
	[SWITCH_LYRICS_INDEX](state, index) {
		state.songState.currentLyricIndex = index
	},
	// 当前时间
	[SWITCH_LYRICS_CURRENTTIME](state, current) {
		state.songState.currentLyricCurrentTime = current
	},
	// 当前句持续时间
	[SWITCH_LYRICS_DURATION](state, ircDuration) {
		state.songState.currentLyricDuration = ircDuration
	},
	// 播放歌曲列表
	[SONG_LIST](state, arr){
		state.songList = arr
	},
	[SONG_INDEX](state, index){
		state.songIndex = index
	},
	// 播放顺序？
	// [SWITCH_PLAY_ORDER](state, order){
	// 	let orderArr = ["cycle", "singleCycle", "random"],
	// 		current = orderArr.indexOf(state.songState.playingOrder),
	// 		next = orderArr.indexOf(order);
	// 	state.songState.playingOrder = next > 0 ? orderArr[next] : orderArr[current >= 2 ? 0 : current + 1]
	// }
}

const actions = {
	// 修改进度
	progressStart({commit}, progressObj = {currentTime: 0, duration: 0}) {
		let current = progressObj.currentTime || 0,
			timing = progressObj.duration || 0,
			newProgress = current/timing;
		if(current/timing >= 1){
			newProgress = 0
			commit(PAUSE, "pause")
			commit(SWITCH_LYRICS_CURRENTTIME, 0)
		}
		commit(MODIFY_PROGRESS, newProgress)
		commit(SWITCH_LYRICS_CURRENTTIME, current)
		commit(SWITCH_DURATION, timing)
	}
}

export default {
	namespaced,
	state,
	mutations,
	actions
}