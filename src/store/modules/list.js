import {TOGGLE_SHOW, MODIFY_CLASS} from "../mutations_type"
const namespaced = true
const state = {
    show: false,
	class: ''
}
const mutations = {
	[TOGGLE_SHOW](state) {
		state.show = !state.show
	},
	[MODIFY_CLASS](state, style) {
		state.class = style
	}
}
const actions = {
	toggleShow({commit}) {
		commit(TOGGLE_SHOW)
	},
	modifyClass({commit}, style){
		commit(MODIFY_CLASS, style)
	}
}

export default {
	namespaced,
	state,
	mutations,
	actions
}