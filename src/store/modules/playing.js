import * as types from "../mutations_type"
const namespaced = true
const state = {
	// playing song detail msg
	songMsg: {
		data: {},
		getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
		songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000'
	},
	// song list
	songlist: [],
	songState: {
		// Music Play State Provide Two State
		// 1: pause, 2: playing + songid
		playingState: 'pause',
		// current time play percentage
		playingProgress: 0,
		// current play progress time
		current: 0,
		// 用于记录歌曲快进或后退后的时间进度
		pruneTime: 0,
		// playing song index in current songlist
		currentIndex: 0,
		// curent playing lyric index in currentLyric array
		currentLyricIndex: '',
		// current lyric playing time
		currentLyricDuration: '',
		// current lyrics array
		currentLyricArr: [],
		// Song Duration Time
		timing: 0,
		// playingOrder provide three state
		// 1: cycle, 2: singleCycle, 3: random,
		playingOrder: 'cycle'
	}
}
// const mutations = {
// 	// play or pause music
// 	[type.PAUSE](state, status) {
// 		let songid = state.songMsg.data.songid;
// 		state.songState.playingState = status == 'pause' || songid == null ? 'pause' : 'playing' + songid;
// 	},
// 	[type.PRUNE_CURRENTTIME](state, time) {
// 		state.songState.pruneTime = state.songState.timing * time || 0;
// 	},
// 	// swtich the current lyric index
// 	[type.SWITCHLYRICINDEX](state, index) {
// 		state.songState.currentLyricIndex = index;
// 	},
// 	[type.SWITCH_LYRICS_ARR](state, lyricArr) {
// 		state.songState.currentLyricArr = lyricArr instanceof Array ? lyricArr : [];
// 	},
// 	[type.SWITCH_LYRUC_DURATION](state, duration) {
// 		state.songState.currentLyricDuration = duration;
// 	},
// 	// stack songlist
// 	[type.STACK_SONG_LIST](state, stack) {
// 		state.songlist = [...(stack instanceof Array ? stack : [stack || {}])];
// 		state.songState.currentIndex = 0;
// 	},
// 	[type.PUSH_SONG_LIST](state, stack) {
// 		state.songlist = [...state.songlist, ...(stack instanceof Array ? stack : [])];
// 	},
// 	[type.SWITCH_PLAY_ORDER](state, order) {
// 		let orderArr = ['cycle', 'singleCycle', 'random'],
// 			current = orderArr.indexOf(state.songState.playingOrder),
// 			next = orderArr.indexOf(order);
// 		state.songState.playingOrder = next > -1 ? orderArr[next] : orderArr[current >= 2 ? 0 : current + 1];
// 	}
// }
const actions = {
	// Reset Play Progress To Some Point
	resetProgress({state, commit, dispatch}, payload = {currentTime: 0, duration: 0}) {
		let current = parseInt(payload.currentTime) || 0,
			timing = parseInt(payload.duration) || 0;

		state.songState.playingProgress = current / timing;
		state.songState.current = current;
		state.songState.timing = timing;
		if (current >= timing && timing > 0) {
			dispatch('playSong', 'next');
			commit('pruneCurrentTime', 0);
		}
	},
	// 用于歌曲的播放进度调整
	pruneProgress({state, dispatch}, progress) {
		let formatProgress;
		if (progress < 0) {
			formatProgress = 0
		} else if (progress > 1) {
			formatProgress = 1;
		} else {
			formatProgress = progress;
		}
		dispatch('resetProgress', {
			currentTime: state.songState.timing * formatProgress,
			duration: state.songState.timing
		});
	},
	/* 
	 * play a new song
	 * index == string ? next : prev
	 * index == number go specify song
	 * */
	playSong({state, commit, dispatch}, index) {
		let nextIndex;
		// judge if play next or play specify song
		if (typeof index == 'string') {
			let playingOrder = state.songState.playingOrder,
				songlist = state.songlist,
				length = songlist.length,
				currentIndex = state.songState.currentIndex;

			switch (playingOrder) {
				case 'cycle':
					if (index == 'next') {
						nextIndex = currentIndex >= length - 1 ? 0 : ++currentIndex;
					} else if (index == 'prev') {
						nextIndex = currentIndex == 0 ? length - 1 : --currentIndex;
					}
					break;
				case 'random':
					nextIndex = Math.random() * songlist.length >> 0;
					break;
				case 'singleCycle':
					nextIndex = currentIndex;
					break;
			}
		} else {
			nextIndex = index >> 0;
		}

		let songMsg = state.songlist[nextIndex];
		state.songState.currentIndex = nextIndex;
		state.songMsg = {...state.songMsg,
			...songMsg
		};
		state.songState.playingState = 'play' + state.songMsg.data.songid;

		dispatch('resetProgress');
	},
	// clear song in stack list
	clearSong({state, dispatch}, index) {
		state.songlist.splice(index >> 0, 1);
	},
	// clear all song msg
	clearSongStack({state, commit, dispatch}) {
		let defaultSongMsg = {
			data: {},
			getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
			songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000'
		};
		state.songlist = [];
		state.songMsg = defaultSongMsg;
		// dispatch('resetProgress');
		commit('pause', 'pause');
	}
}
export default {
	namespaced,
	state,
	// mutations,
	actions
}