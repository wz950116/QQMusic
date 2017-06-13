import { SET_TRANSITION } from "../mutations_type"
const namespaced = true
const state = {
	transitionName: '',
	action: []
}
const mutations = {
	[SET_TRANSITION](state, transition) {
		state.transitionName = transition;
	}
}

export default {
	namespaced,
	state,
	mutations
}