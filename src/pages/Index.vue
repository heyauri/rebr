<template>
    <q-page class="row justify-evenly">
        <div></div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "PageIndex",
    components: { },
    setup() {},
    data() {
        return {
            dialogShow: false
        };
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        sendMsg(type: any, msg: any) {
            // @ts-ignore : $global在原型中不存在
            this.$global.$emit(type, msg);
        },
    },
});
</script>
