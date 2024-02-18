<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox :value="true"
          >我已阅读并同意「用户协议」和「隐私条款」</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import auth from '@/utils/auth'
export default {
  name: 'Login',
  data () {
    const checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不对'))
      }
    }
    return {
      form: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const res = await this.$http.post('/v1_0/authorizations', this.form)
            auth.setToken(res.data.data.token)
            this.$router.push('/')
          } catch (error) {
            this.$message.error(error.response.data.message || '登录失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  padding: 0 20px;
  .el-button {
    width: 100%;
  }
}
</style>
