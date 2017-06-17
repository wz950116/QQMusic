<template>
    <div id="app">
    	<keep-alive>
        	<router-view></router-view>
        </keep-alive>
        <footer-playing></footer-playing>
    </div>
</template>

<script>
export default {
    name: 'app',
    components: {
		footerPlaying(resolve) {
			require(["components/footer.vue"], resolve)
		}
    }
}
</script>

<style>
	
</style>
