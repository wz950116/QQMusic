import Vue from 'vue'
import Vuex from 'vuex'

import list from "./modules/list"
import transition from "./modules/transition"
import playing from "./modules/playing"

import * as getters from './getters'
import {getCurrentIndex, shuffle, floatNumber } from '../public'

Vue.use(Vuex)

export default new Vuex.Store({
	getters,
	modules: {
		list,
		transition,
		playing
	}
})
