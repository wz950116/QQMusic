import {PLAY_SONG, SWITCH_LYRICS_ARR, PAUSE, MODIFY_PROGRESS, SWITCHLYRICINDEX, TOGGLE_SHOW} from "../mutations_type.js";

const namespaced = true

const state = {  
	// 歌曲信息
	songMsg: {
		data: {
			songid: "",     // 歌曲ID
			songname: "",   // 歌曲名
			singer: "",     // 歌手
			albumname: "",   // 专辑名
			albummid: ""
		},
		// 专辑icon的baseURL
		songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000',
		// 音频URL
		getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
	},
	// 歌曲状态
	songState: {
		// 当前播放列表
		currentLyricArr: "",
		// pause or play+id or 空
		playingState: "pause",
		// 播放进度progress
		playingProgress: 0
	}
}

const mutations = {
	// 歌曲ID
	[PLAY_SONG](state, data) {
		state.songMsg.data.songid = data.songid || ""
		state.songMsg.data.songname = data.songname  || ""
		state.songMsg.data.singer = data.singer  || []
		state.songMsg.data.albumname = data.albumname || "",
		state.songMsg.data.albummid = data.albummid || ""
	},
	[SWITCH_LYRICS_ARR](state, lyricArr) {
		// 判断传入是否为数组
		state.songState.currentLyricArr = lyricArr instanceof Array ? lyricArr : []
	},
	// 暂停 播放
	[PAUSE](state, musicState) {
		state.songState.playingState = musicState
	},
	// 进度
	[MODIFY_PROGRESS](state, newProgress) {
		state.songState.playingProgress = newProgress
	}
}

const actions = {
	// 修改进度
	progressStart({commit}, progressState = {currentTime: 0, duration: 0}) {
		let current = progressState.currentTime || 0,
			timing = progressState.duration || 0,
			newProgress = current/timing;
		if(current/timing > 0.98){
			newProgress = 0
			commit(PAUSE, "pause")
		}
		commit(MODIFY_PROGRESS, newProgress)
	}
}

export default {
	namespaced,
	state,
	mutations,
	actions
}