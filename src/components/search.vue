<template>
    <div class="mint-search">
        <div class="mint-searchbar">
            <div class="mint-searchbar-inner">
                <i class="mintui mintui-search"></i>
                <input
                    type="search"
                    class="mint-searchbar-core"
                    style="padding:0 5px"
                    ref="input"
                    v-model="currentValue"
                    :placeholder="placeholder"
                    @click="visible = true">
            </div>
            <a
                class="mint-searchbar-cancel"
                v-show="visible"
                v-text="cancelText"
                @click="visible = false, currentValue = ''">
            </a>
        </div>
        <div class="mint-search-list" v-show="visible">
            <div class="mint-search-list-warp">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mt-search',
    data () {
        return {
            visible: false,  
            // 子组件不建议修改父组件通过props传递过来的值
            currentValue: this.value
        }
    },
    props: {
        // 输入框内容
        value: {
            type: String,
            default () {
                return ""
            }
        },
        autofocus: {
            type: Boolean,
            default () {
                return false
            }
        },
        cancelText: {
            type: String,
            default () {
                return "取消"
            }
        },
        placeholder: {
            type: String,
            default () {
                return "搜索"
            }
        },
        // 搜索结果
        result: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        currentValue (val) {
            // 这里默认父级v-model即@input事件
            this.$emit('input', val);
        },
        visible () {
            // 这里默认更新父级:visible.sync的值
            this.$emit('update:visible', this.visible);
        }
    },
    mounted () {
        // 加载完毕后是否获取焦点
        this.autofocus && this.$refs.input.focus();
    }
};
</script>
