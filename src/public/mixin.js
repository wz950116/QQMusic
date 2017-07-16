import Vue from 'vue';
import store from '../store';
import {stackSonglist, getCurrentIndex} from './index.js';

// Vuex Playing Module NameSpace
const NameSpace = 'playing';

// 全局函数
export default {
	playMusic (songlist, index, songid) {
		let song = songlist[index],
			stack = stackSonglist(songlist, index),
			songIndex = getCurrentIndex(stack, songid);
			
		store.commit(NameSpace + '/stackSonglist', stack);
		store.dispatch(NameSpace + '/playSong', songIndex);
	},
	goSpecial (url) {
		this.$router.push({
			name: 'special',
			query: {
				url: encodeURIComponent(url)
			}
		});
	}
}