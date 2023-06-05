<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>🥳 每日一句</span>
    </div>
    <div>
      <div class="has-text-left block">
        {{ tip.content }}
      </div>
      <div class="has-text-right mt-5 block">
        ——{{ tip.author }}
      </div>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'Tip',
  data() {
    return {
      tip: {
          content: '每日一句',
          author: '作者'
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
