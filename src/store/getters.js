const show = store => store.show
const transitionName = store => store.transitionName
const action = store => store.action
const songMsg_data = store => store.songMsg.data
const songMsg_getMedia = store => store.songMsg.getMedia
const songlist = store => store.songlist
const songState_playingState = store => store.songState.playingState
const songState_playingProgress = store => store.songState.playingProgress
const songState_current = store => store.songState.current
const songState_pruneTime = store => store.songState.pruneTime
const songState_currentIndex = store => store.songState.currentIndex
const songState_currentLyricIndex = store => store.songState.currentLyricIndex
const songState_currentLyricDuration = store => store.songState.currentLyricDuration
const songState_currentLyricArr = store => store.songState.currentLyricArr
const songState_timing = store => store.songState.timing
const songState_playingOrder = store => store.songState.playingOrder