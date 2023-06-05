<template>
    <el-card class="box-card" shadow="never">
        <div slot="header">
            <span>🥂 推广</span>
        </div>
        <div>
            <p v-for="(item, index) in list" :key="index" class="block">
                <a :href="item.link" target="_blank">{{ item.title }}</a>
            </p>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'Promotion',
    data() {
        return {
            list: []
        }
    },
    created() {
    },
    methods: {}
}
</script>

<style scoped>
</style>
