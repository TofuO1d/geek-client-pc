<template>
  <div class="publish-page">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            >{{ $route.query.id ? '修改' : '发布' }}文章</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form
        label-width="120px"
        :model="articleForm"
        :rules="articleRules"
        ref="articleForm"
      >
        <el-form-item label="标题：" prop="title">
          <el-input
            v-model="articleForm.title"
            placeholder="请输入文章标题"
            style="width:400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-radio-group
            v-model="articleForm.cover.type"
            @change="changeCoverType()"
          >
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div
            v-if="articleForm.cover.type === 1 || articleForm.cover.type === 3"
          >
            <el-upload
              ref="upload"
              :action="`${$http.defaults.baseURL}v1_0/upload`"
              name="image"
              :headers="{ Authorization: `Bearer ${token}` }"
              list-type="picture-card"
              :limit="articleForm.cover.type"
              :on-success="uploadSuccess"
              :on-remove="removeFile"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <quill-editor
            v-model="articleForm.content"
            :options="editorOption"
            @blur="checkContent()"
          />
        </el-form-item>
        <el-form-item label="" v-if="$route.query.id">
          <el-button @click="update(false)" type="primary">修改文章</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item label="" v-else>
          <el-button @click="submit(false)" type="primary">发布文章</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import myChannel from '@/components/my-channel.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import auth from '@/utils/auth'
// 自定义校验规则
const checkCoverFn = (rule, value, cb) => {
  // 自己对value进行校验
  if (value.type === 1) {
    if (!value.images[0]) {
      return cb(new Error('请选择一张封面图'))
    }
  }
  if (value.type === 3) {
    if (!(value.images[0] && value.images[1] && value.images[2])) {
      return cb(new Error('请选择三张封面图'))
    }
  }
  // 代码走到这，校验成功
  cb()
}
export default {
  components: { myChannel, quillEditor },
  name: 'PublishPage',
  data () {
    return {
      // 表单数据
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置
      editorOption: {},
      token: auth.getToken(),
      // 校验规则
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 50, message: '文章标题4-50字符', trigger: 'blur' }
        ],
        cover: [{ validator: checkCoverFn, trigger: 'change' }],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getArticle(this.$route.query.id)
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.id) {
      this.getArticle(to.query.id)
    } else {
      this.$refs.articleForm.resetFields()
    }
    next()
  },
  computed: {
    fileList () {
      return this.articleForm.cover.images.map(item => ({
        name: item,
        url: item
      }))
    }
  },
  methods: {
    changeCoverType () {
      this.articleForm.cover.images = []
      this.$refs.upload && this.$refs.upload.clearFiles()
      // 自己再次校验
      this.$refs.articleForm.validateField('cover')
    },
    uploadSuccess (res) {
      this.articleForm.cover.images.push(res.data.url)
      // 触发一次校验
      this.$refs.articleForm.validateField('cover')
    },
    checkContent () {
      // 校验内容表单项
      this.$refs.articleForm.validateField('content')
    },
    // 删除文件
    removeFile (file) {
      // 主动：删除images数组中对应的图片
      // file 中保存了之前上传图片响应的信息 response.data.url 图片地址
      // 根据这个图片地址找到images对应的索引，通过splice(索引,1) 删除图片
      const index = this.articleForm.cover.images.findIndex(
        item => item === file.response.data.url
      )
      this.articleForm.cover.images.splice(index, 1)
      // 自己再次校验
      this.$refs.articleForm.validateField('cover')
    },
    submit (draft) {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          this.$http
            .post('/v1_0/mp/articles?draft=' + draft, this.articleForm)
            .then(res => {
              this.$message.success('发布成功')
              this.$router.push('/article')
            })
            .catch(() => {
              this.$message.error('发布失败')
            })
        }
      })
    },
    getArticle (id) {
      this.$http.get('/v1_0/mp/articles/' + id).then(res => {
        this.articleForm = res.data.data
      })
    },
    update (draft) {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          this.$http
            .put(
              '/v1_0/mp/articles/' + this.$route.query.id + '?draft=' + draft,
              this.articleForm
            )
            .then(res => {
              this.$message.success('修改成功')
              this.$router.push('/article')
            })
            .catch(() => {
              this.$message.error('修改失败')
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-select {
  width: 400px;
}
::v-deep .el-upload-list__item {
  transition: none;
}
</style>
