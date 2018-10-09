<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键字" v-model="listQuery.keywords" style="width: 200px;" class="filter-item" v-on:input="handleFilter" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">审核人</el-checkbox> -->
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      @sort-change="sort"
      show-summary
      sum-text="合计"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="65" sortable ="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="80px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信用额度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creditLimit.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已用额度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.creditLimit - scope.row.availableCredit).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用额度" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.availableCredit.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款日" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dueDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" width="60" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleSend(scope.row)">更新</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button> -->
          <a href="#">
            <i class="fa fa-credit-card"></i>
          </a>
          <a href="#">
            <i class="fa fa-instagram"></i>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-pagination v-show="total>0" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog @close="handleClose" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="45%">
      <el-form v-if="step0" ref="dataForm" :rules="rules" :model="apiTemp" label-position="right" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="描述" prop="dscription">
          <el-input v-model="apiTemp.dscription"/>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-input v-model="apiTemp.packageName"/>
        </el-form-item>
        <el-form-item label="类名" prop="className">
          <el-input v-model="apiTemp.className"/>
        </el-form-item>
        <el-form-item label="方法" prop="methodInfo">
          <el-input v-model="apiTemp.methodInfo"/>
        </el-form-item>
      </el-form>   
     
      <div v-if="step1">
        <el-form :model="apiEntity" label-position="right" label-width="80px" size="medium">
          <el-row>
            <el-col :span="12">
              <el-form-item label="api描述:">
                  <el-input v-model="apiEntity.dscription" placeholder="api描述"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="api名称:">
                  <el-input v-model="apiEntity.dubboApiName" placeholder="api名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="方法名:">
                  <el-input v-model="apiEntity.dubboMethodName" placeholder="方法名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数类型:">
                  <el-input v-model="apiEntity.dubboMethodTypes" placeholder="参数类型"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table :data="apiParamEntitys" border align="center" style="width: 100%">

          <el-table-column
            prop="dispName"
            label="dispName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dispName" size="medium"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="name">
             <template slot-scope="scope">
              <el-input v-model="scope.row.name" size="medium"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="paramType"
            label="paramType">
             <template slot-scope="scope">
              <el-input v-model="scope.row.paramType" size="medium"/>
            </template>
          </el-table-column>
          
        </el-table>
      </div>
      
      <div v-if="step2">
          <p>{{apiEntityInsertSql}}</p>
          <p v-for="sql in apiParamEntityInsertSqls" :key="sql">
            {{sql}}
          </p>
        </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{textMap[bStatus]}}</el-button>
         <el-button v-if="step0" type="primary" @click="go2CheckAndSave">下一步</el-button>
        <el-button v-if="step1" type="primary" @click="createData">确认</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">确认</el-button> -->
      </div>
    </el-dialog>

     <el-dialog @close="handleClose" title="调试" :visible.sync="dialogForSend" width="50%">
      <el-table :data="apiParamEntitys" border align="center" style="width: 100%">
        <el-table-column prop="name" label="参数名" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="paramTypeStr" label="类型" width="150px">
          <template slot-scope="scope">
             <span>{{ scope.row.paramTypeStr }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dispName" label="说明" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.dispName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="value" label="值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" size="medium"/>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{textMap[bStatus]}}</el-button>
        <el-button v-if="step1" type="primary" @click="createData">send</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">确认</el-button> -->
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, fetchApiParamList } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        keywords: ''
      },
      calendarTypeOptions,
      showReviewer: false,
      step0: true,
      step1: false,
      step2: false,
      bStatus: 'cancle',
      temp: {
        id: undefined,
        dscription: '描述',
        packageName: 'cn.fantasticbro.demo.service',
        className: 'ApiEntityService',
        methodInfo: 'saveApiInfo(String apiEntitys, String apiParamEntitys)'
      },
      apiTemp: {
        id: undefined,
        dscription: '描述',
        packageName: 'cn.fantasticbro.demo.service',
        className: 'ApiEntityService',
        methodInfo: 'saveApiInfo(String apiEntitys, String apiParamEntitys)'
      },
      apiEntity: {
        id: undefined,
        dscription: '',
        dubboApiName: '',
        dubboMethodName: '',
        dubboMethodTypes: ''
      },
      apiParamEntitys: [],
      apiEntityInsertSql: '',
      apiParamEntityInsertSqls: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        sqls: 'sqls',
        cancle: '取消',
        close: '关闭'
      },
      dialogForSend: false,
      pvData: [],
      rules: {
        dscription: [{ required: true, message: '请填写接口描述信息', trigger: 'blur' }],
        packageName: [{ required: true, message: '请填写包名', trigger: 'blur' }],
        className: [{ required: true, message: '请填写类名', trigger: 'blur' }],
        methodInfo: [{ required: true, message: '请填写方法信息', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sort(a) {
      console.log(a)
    },
    async getList() {
      this.listLoading = true
      await fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.recordsTotal

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    async getApiParamList(id) {
      this.listLoading = true
      await fetchApiParamList(id).then(response => {
        this.apiParamEntitys = response.data
        console.log(response)
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      // 搜索方法
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      // pageSize change事件
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // pageNo change 事件
      this.listQuery.pageNo = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      // 删除方法
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleClose() {
      // dialogFormVisible关闭事件
      // 重置按钮状态
      this.bStatus = 'cancle'
      this.dialogStatus = 'create'
      this.step0 = true
      this.step1 = false
      this.step2 = false
      // 重置数据
      this.apiTemp = {
        id: undefined,
        dscription: '',
        packageName: '',
        className: '',
        methodInfo: ''
      }
      this.apiEntity = {
        id: undefined,
        dscription: '',
        dubboApiName: '',
        dubboMethodName: '',
        dubboMethodTypes: ''
      }
      this.apiParamEntitys = []
      this.apiEntityInsertSql = ''
      this.apiParamEntityInsertSqls = []
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    go2CheckAndSave() {
      // 第二部
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const methodInfo = this.apiTemp.methodInfo
          const methodName = methodInfo.substring(0, methodInfo.indexOf('('))
          const param = methodInfo.substring(methodInfo.indexOf('(') + 1, methodInfo.lastIndexOf(')'))
          const apiParamEntitys = []
          if (param !== null && param !== '') {
            const paramArray = param.split(',')
            let dubboMethodTypes = ''
            for (var i = 0; i < paramArray.length; i++) {
              const apiParamEntity = {
                dispName: '',
                name: '',
                paramType: ''
              }
              const ps = paramArray[i].trim().split(' ')
              apiParamEntity.dispName = ps[1]
              apiParamEntity.name = ps[1]
              apiParamEntity.paramType = 'java.lang.' + ps[0]
              if (dubboMethodTypes === '') {
                dubboMethodTypes = 'java.lang.' + ps[0]
              } else {
                dubboMethodTypes += ',java.lang.' + ps[0]
              }
              apiParamEntitys[i] = apiParamEntity
            }
            this.apiEntity.dscription = this.apiTemp.dscription
            this.apiEntity.dubboMethodName = methodName
            this.apiEntity.dubboMethodTypes = dubboMethodTypes
            this.apiEntity.dubboApiName = this.apiTemp.packageName + '.' + this.apiTemp.className
            this.apiParamEntitys = apiParamEntitys
          }
          this.step0 = false
          this.step1 = true
        }
      })
    },
    handleCreate() {
      this.handleClose()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // 保存方法
      const data = {
        apiEntitys: JSON.stringify(this.apiEntity),
        apiParamEntitys: JSON.stringify(this.apiParamEntitys)
      }
      createArticle(data).then(response => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
        this.apiEntityInsertSql = response.apiEntityInsertSql
        this.apiParamEntityInsertSqls = response.apiParamEntityInsertSqls
        this.step1 = false
        this.step2 = true
        this.dialogSbsttatus = 'sqls'
        this.bStatus = 'close'
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSend(row) {
      this.dialogForSend = true
      console.log(row)
      this.getApiParamList(row.id)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  //设置分页样式靠右显示
  .el-pagination {
    white-space: nowrap;
    padding: 20px 5px;
    color: #303133;
    font-weight: 700;
    float:right;
  }
</style>
