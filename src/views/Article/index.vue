<template>
  <div class="article-page">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select
            clearable
            v-model="reqParams.channel_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            @change="changeDate"
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="filterArticles()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 结果区域 -->
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{ total }} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.cover.images[0]"
              style="width:200px;height:150px"
            >
              <div slot="error" class="image-slot">
                <img
                  src="../../assets/logo.png"
                  alt=""
                  width="200px"
                  height="150px"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success"
              >审核通过</el-tag
            >
            <el-tag v-if="scope.row.status === 3" type="warning"
              >审核失败</el-tag
            >
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="$router.push('/publish?id=' + scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              @click="deleteArticle(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    </el-card>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
      background
      layout="prev, pager, next"
      :current-page="reqParams.page"
      @current-change="togglePage"
      :page-size="reqParams.per_page"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      total: 0,
      // 提交给后台的参数
      reqParams: {
        // 默认值为null，使用axios提交的时候null值是不会传递的。
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 10
      },
      // 频道选项
      channelOptions: [
        { value: 1, label: '前端' },
        { value: 2, label: 'java' }
      ],
      // 日期范围 [起始时间，结束时间]
      dateArr: []
    }
  },
  created () {
    this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    async getChannelOptions () {
      const res = await this.$http.get('v1_0/channels')
      this.channelOptions = res.data.data.channels
    },
    async getArticles () {
      const res = await this.$http.get('v1_0/mp/articles', {
        params: this.reqParams
      })
      this.articles = res.data.data.results
      this.total = res.data.data.total_count
      console.log(this.articles)
    },
    togglePage (changedPage) {
      this.reqParams.page = changedPage
      this.getArticles()
    },
    filterArticles () {
      this.reqParams.page = 1
      console.log(this.reqParams)
      this.getArticles()
    },
    changeDate (dateArr) {
      // 日期访问改变后给reqParams中的日期赋值
      // dateArr 选择日期后 [start,end]
      // dateArr 用户做清空 null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    deleteArticle (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除请求
          await this.$http.delete(`v1_0/mp/articles/${id}`)
          // 删除成功
          this.$message.success('删除文章成功')
          this.getArticles()
        })
        .catch(() => {
          // 取消不做任何事情
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
