<template>
  <el-select
    :value="value"
    placeholder="请选择"
    @change="changeChannel"
    clearable
  >
    <el-option
      v-for="item in channelOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MyChannel',
  data () {
    return {
      channelId: null,
      channelOptions: []
    }
  },
  props: ['value'],
  created () {
    this.getChannelOptions()
  },
  methods: {
    async getChannelOptions () {
      const res = await this.$http.get('/v1_0/channels')
      this.channelOptions = res.data.data.channels
    },
    changeChannel (changedChannelId) {
      // 通知父组件，频道ID已变化，你也需要改变
      this.$emit('input', changedChannelId)
    }
  }
}
</script>

<style scoped lang="less">
.el-select {
  width: 400px;
}
</style>
