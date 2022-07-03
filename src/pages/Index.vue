<template>
    <q-page class="row justify-evenly" style="width: 100%">
        <div class="row items-center" style="width: 100%">
            <div class="col-8 q-pa-lg">
                <q-input outlined color="primary" v-model="targetUrl" label="网址"
                    placeholder="以http://或https://开头的目标页面">
                </q-input>
            </div>
            <div class="col-3 q-pa-sm text-right">
                <q-btn size="md" align="between" color="secondary" label="访问网站" icon="check" @click="accessWebpage" />
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "PageIndex",
    components: {},
    setup() { },
    data() {
        return {
            dialogShow: false,
            targetUrl: "https://www.qq.com"
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
        accessWebpage() {
            let url = this.targetUrl;
            if (!/https:\/\//.test(url) && !/http:\/\//.test(url)) {
                alert("请输入以http://或https://开头的网址");
                return;
            }
            this.sendMsg("accessUrl", this.targetUrl);
        }
    },
});
</script>
