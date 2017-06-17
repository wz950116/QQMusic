<template>
	<div class="page playing-container">
		
	</div>
</template>

<script>
	export default {
		name: "playing",
		data() {
			return {

			}
		},
	}
</script>

<style lang="sass" scoped>
	.playing-container {
		z-index: 4;
		.bgimg-blur, .overlay {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			filter: blur(15px);
		}
		.bgimg-blur {
			z-index: -2;
			transform: scale(1.15);
			background-size: cover;
			background-position: bottom center;
		}
		.overlay {
			z-index: -1;
			background-color: rgba(0, 0, 0, .4);
		}
		.content-wrapper {
			display: flex;
			align-items: space-around;
			flex-wrap: wrap;
			margin-top: 2.4rem;
			height: 100%;
			.ablum-wrapper {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
			}
			.ablum-wrapper, .play-wrapper {
				flex-basis: 100%;
			}
		}
		.ablum-wrapper {
			.title-wrap {
				width: 100%;
				font-size: 14px;
				text-align: center;
				color: $white-base;
			}
			.ablum {
				@include img-responsive;
				@include center-auto;
				width: 88%;
				border-radius: 50%;
				border: 8px solid rgba(0, 0, 0, .3);
			}
			.lyric {
				width: 100%;
				height: 20px;
				line-height: 20px;
				color: $white-base;
				text-align: center;
				overflow: hidden;
			}
		}
		.play-control {
			display: flex;
			margin-top: 10px;
			padding: 0 20px;
			justify-content: space-between;
			align-items: center;
			.back-icon {
				width: 2rem;
				height: 2rem;
			}
			.play-icon {
				width: 3rem;
				height: 3rem;
			}
			.order-icon, {
				height: 1.5rem;
			}
			.list-icon {
				width: 1.25rem;
				height: 1.5rem;
			}
		}
	}
</style>