import { SET_TRANSITION } from "../mutations_type"
const namespaced = true
const state = {
	transitionName: 'hello',
	action: []
}
const mutations = {
	[SET_TRANSITION](state, transition) {
		state.transitionName = transition;
	}
}
const actions = {
	setTransition({commit}, transition) {
		console.log(transition);
		commit(SET_TRANSITION, transition)
	}
}

export default {
	namespaced,
	state,
	mutations,
	actions
}