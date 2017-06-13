import { TOGGLE_SHOW, MODIFY_CLASS } from "../mutations_type"
const namespaced = true
const state = {
	// if show the list
	show: false,
	// modify the list style
	class: ''
}
const mutations = {
	[TOGGLE_SHOW](state) {
		// state.show = !state.show;
	},
	[MODIFY_CLASS](state, style) {
		// state.class = style;
	}
}

export default {
	namespaced,
	state,
	mutations
}