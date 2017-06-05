<template>
	<div class="fallback">
		<i class="mintui mintui-back arrow" @click="goBack()"></i>
	</div>
</template>

<script>
	// vuex2.0的辅助函数 使得状态的管理更加方便 防止代码冗余
	import { mapMutations } from 'vuex';
	export default {
		name: "goBack",
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			// 设置两个方法
			...mapMutations("transition",["setTransition", "setAction"])
		}
	}
</script>
