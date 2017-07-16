import {SONG_MSG, PLAY_SONG, PAUSE, MODIFY_PROGRESS, SWITCH_DURATION, SWITCH_LYRICS_ARR, SWITCH_LYRICS_INDEX, SWITCH_LYRICS_CURRENTTIME, SWITCH_LYRICS_DURATION, SONG_LIST, SONG_INDEX, SWITCH_PLAY_ORDER} from "../mutations_type.js";

const namespaced = true;

const state = {  
	// 歌曲信息
	songMsg: {
		data: {
			// songid: ""     // 歌曲ID
			// songname: "",   // 歌曲名
			// singer: "",     // 歌手
			// albumname: "",  // 专辑名
			// albummid: ""    // 专辑ID
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
		// 当前歌词列表
		currentLyricArr: [],
		// 当前歌词索引值
		currentLyricIndex: "",
		// 当前时间/
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
	[SONG_MSG] (state, msgObj) {
		state.songMsg.data = msgObj
	},
	// 歌曲ID
	[PLAY_SONG] (state, msgObj) {
		state.songMsg = {...state.songMsg, ...msgObj}
	},
	// 暂停 播放
	[PAUSE] (state, musicState) {
		state.songState.playingState = musicState
	},
	// 进度
	[MODIFY_PROGRESS] (state, newProgress) {
		state.songState.playingProgress = newProgress
	},
	// 总时长
	[SWITCH_DURATION] (state, duration) {
		state.songState.currentDuration = duration
	},
	// 歌词
	[SWITCH_LYRICS_ARR] (state, arr) {
		// 判断传入是否为数组
		state.songState.currentLyricArr = arr instanceof Array ? arr : []
	},
	// 当前句索引
	[SWITCH_LYRICS_INDEX] (state, index) {
		state.songState.currentLyricIndex = index
	},
	// 当前时间
	[SWITCH_LYRICS_CURRENTTIME] (state, current) {
		state.songState.currentLyricCurrentTime = current
	},
	// 当前句持续时间
	[SWITCH_LYRICS_DURATION] (state, ircDuration) {
		state.songState.currentLyricDuration = ircDuration
	},
	// 播放歌曲列表
	[SONG_LIST] (state, arr) {
		state.songList = arr
	},
	// 当前歌曲索引值
	[SONG_INDEX] (state, index) {
		state.songState.songIndex = index
	},
	// 播放顺序
	[SWITCH_PLAY_ORDER] (state, order) {
		state.songState.playingOrder = order
	}
}

const actions = {
	// 进度
	progressStart ({commit, dispatch}, progressObj) {
		let current = progressObj.currentTime,
			timing = progressObj.duration,
			newProgress = current / timing,
			musicId = state.songMsg.data.songid;

		if (current / timing >= 0.98) {
			newProgress = 0;
			let order = state.songState.playingOrder;
			switch (order) {
				case "cycle":
					commit(SWITCH_LYRICS_CURRENTTIME, 0);
					dispatch("playSong", "next");
					break;
				case "singleCycle":
					let index = state.songState.songIndex;
					break;
				case "random":
					let length = state.songList.length,
						num = parseInt(Math.random()*length),
						songMsg =  state.songList[num];
					commit(PLAY_SONG, songMsg);
					commit(SONG_INDEX, num);
					break;
				default:
					commit(PAUSE, "pause");
					break;
			}
		}
		// 这里必须及时更改状态 否则无法重新触发timeupdate事件
		if (state.songState.playingState !== "pause") {
			commit(PAUSE, "play" + musicId);
		}
		commit(MODIFY_PROGRESS, newProgress);
		commit(SWITCH_LYRICS_CURRENTTIME, current);
		commit(SWITCH_DURATION, timing);
	},
	playSong ({commit}, param) {
		let newIndex,
			songIndex = state.songState.songIndex,
			length = state.songList.length,
			initProgres = {};

		if(typeof param == "string") {
			switch (param) {
				case "next":
					newIndex = songIndex >= length - 1 ? 0 : ++songIndex;
					break;
				case "prev":
					newIndex = songIndex <= 0 ? length - 1 : --songIndex;
					break;
				default:
					break;
			}
			let songMsg =  state.songList[newIndex];

			// 进度条初始化
			commit(MODIFY_PROGRESS, 0);
			// 更改歌词信息
			commit(PLAY_SONG, songMsg);
			// 更改当前歌曲索引
			commit(SONG_INDEX, newIndex);
		} else {
			commit(SONG_MSG, param);
		}
	},
	// 修改播放顺序
	switchPlayOrder ({commit}, order) {
		let newOrderIndex = ["cycle", "singleCycle", "random"].indexOf(state.songState.playingOrder)
		switch (order) {
			case "cycle":
				commit(SWITCH_PLAY_ORDER, "cycle")
				break
			case "singleCycle":
				commit(SWITCH_PLAY_ORDER, "singleCycle")
				break
			case "random":
				commit(SWITCH_PLAY_ORDER, "random")
				break
			default:
				newOrderIndex++
				let newOrder = newOrderIndex > 2 ? "cycle" : ["cycle", "singleCycle", "random"][newOrderIndex]
				commit(SWITCH_PLAY_ORDER, newOrder)
				break
		}
	}
}

export default {
	namespaced,
	state,
	mutations,
	actions
}