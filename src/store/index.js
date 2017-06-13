import Vue from 'vue'
import Vuex from 'vuex'
// import * as store from "./modules"
import list from "./modules/list"
import playing from "./modules/playing"
import transition from "./modules/transition"
import * as getters from './getters'
import {getCurrentIndex, shuffle, floatNumber } from '../public'

Vue.use(Vuex);

export default new Vuex.Store({
	getters,
	modules: {
		list,
		playing,
		transition
	}
});
