<template>
  <el-container class="container">
    <el-aside width="200px">
      <el-menu
        background-color="#023"
        style="border-right:none"
        text-color="#fff"
        default-active="$route.path"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">数据概览</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span style="margin-right:20px">{{ user.name || user.mobile }}</span>
        <el-link icon="el-icon-unlock" :underline="false" @click="logout()"
          >退出</el-link
        >
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import auth from '@/utils/auth'
export default {
  name: 'Layout',
  data () {
    return {
      user: {}
    }
  },
  async created () {
    const res = await this.$http.get('v1_0/user/profile')
    this.user = res.data.data
  },
  methods: {
    logout () {
      auth.delToken()
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #023;
    .logo {
      width: 200px;
      height: 60px;
      background: #023 url(../../assets/logo.png) no-repeat center / 160px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
