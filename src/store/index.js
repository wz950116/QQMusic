import Vue from 'vue';
import Vuex from 'vuex';
import * as store from "./modules"
import * as getters from './getters'
import {getCurrentIndex, shuffle, floatNumber } from '../public';

Vue.use(Vuex);

export default new Vuex.Store({
	getters,
	modules: {
		store.transition,
		store.list,
		store.playing
	}
});
