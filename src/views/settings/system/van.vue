<template>
  <div class="app-container">
    <div style="margin: 10px 0">
      <el-input v-model="listQuery.license" placeholder="牌照" style="width: 160px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.state" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-left: 10px">
        <el-option v-for="item in stateOptions" :key="item.id" :label="item.state" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button @click="handleDelete">批量删除</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>

    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      highlight-current-row
      style="width: 90% ;margin-top:20px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="ID" width="140" align="center" HIDDEN="true">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牌照" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.license }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大载重/kg" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.maxLoad }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="140" align="center">
        <template slot-scope="{row}">
          <span>
            <el-tag :type="getTag(row.state)">
              {{ row.state==0?'空闲':(row.state==1?'运输中':'维修中') }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="信息" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      :current-page="currentPage"
      :page-sizes="[1,5,10,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      style="width: 90% ;margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="temp" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus === '编辑'" label="id" prop="id">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="牌照" prop="license">
          <el-input v-model="temp.license" placeholder="请输入牌照" />
        </el-form-item>
        <el-form-item label="最大载重/kg" prop="maxLoad">
          <el-input type="number" v-model="temp.maxLoad" placeholder="请输入最大载重" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="Number(0)">空闲</el-radio>
            <el-radio :label="Number(1)">运输中</el-radio>
            <el-radio :label="Number(2)">维修中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="info">
          <el-input v-model="temp.info" type="textarea" :rows="2" placeholder="请输入车辆描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='新增'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { addVan, updateVan, deleteVan, getVanList } from '@/api/van'

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      // rules: {
      //   userName: [
      //     { required: true, trigger: 'blur', message: '请输入用户名' },
      //     { max: 20, message: '用户名长度不能超过20个字符', trigger: 'blur' }
      //   ],
      //   realName: [
      //     { required: true, trigger: 'blur', message: '请输入真实姓名' },
      //     { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '真实姓名必须为中文，且长度在2-4个字符之间', trigger: 'blur' }
      //   ],
      //   password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
      //   sex: [{ required: true, trigger: 'blur' }],
      //   phone: [
      //     { required: true, trigger: 'blur', message: '请输入手机号码' },
      //     { pattern: /^\d{11}$/, message: '手机号码必须为11位数字', trigger: 'blur' }
      //   ],
      //   entryTime: [{ required: true, trigger: 'blur' }],
      //   birthday: [{ required: true, trigger: 'blur' }]
      // },
      listQuery: {
        license: '',
        state: ''
      },
      temp: {
        id: '',
        license: '',
        maxLoad: '',
        state: '0',
        info: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableData: [],
      multiSelection: [],
      refresh: false,
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10, // 每页的数据条数
      stateOptions: [{ id: 0, state: '空闲' }, { id: 1, state: '运输中' }, { id: 2, state: '维修中' }],
      pattern: {
        userName: /^[A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
        realName: /^[\u4e00-\u9fa5]{2,4}$/,
        phone: /^\d{11}$/
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // getOptions() {
    //   getRoles().then(res => {
    //     res.data.roleList.forEach(item => {
    //       const data = {}
    //       data.roleName = item.roleName
    //       data.roleId = item.roleId
    //       this.options.push(data)
    //     })
    //   })
    //   console.log(this.options)
    // },
    getList() {
      this.listLoading = true
      this.tableData = []
      getVanList(this.listQuery).then(response => {
        // console.log(this.listQuery)
        this.tableData = []
        response.data.vanList.forEach(item => {
          const data = {}
          data.id = item.id
          data.license = item.license
          data.state = item.state
          data.info = item.info
          data.maxLoad = item.maxLoad
          this.tableData.push(data)
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: '',
        license: '',
        maxLoad: '',
        state: '',
        info: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '新增'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    createData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          addVan({
            maxLoad: this.temp.maxLoad,
            license: this.temp.license,
            state: this.temp.state,
            info: this.temp.info
          }).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          // 获取具体的错误信息
          this.$message.error('格式不正确')
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.roleIds = this.temp.roles.map(role => role.roleId)
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          // const data = {
          //   username: this.temp.userName,
          //   id: this.temp.userId,
          //   password: this.temp.password,
          //   realName: this.temp.realName,
          //   phone: this.temp.phone,
          //   sex: this.temp.sex,
          //   entryTime: this.temp.entryTime,
          //   birthday: this.temp.birthday
          // }
          updateVan({
            id: this.temp.id,
            license: this.temp.license,
            state: this.temp.state,
            maxLoad: this.temp.maxLoad,
            info: this.temp.info
          }).then(() => {
            // console.log({ userId: this.temp.userId, roleIds: this.roleIds })
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          if (this.temp.password.isEmpty()) {
            this.$message.error('请输入密码')
          }
        }
      })
    },
    handleDelete() {
      const delData = []
      this.multipleSelection.forEach(select => {
        // const del = {}
        // del.userId = select.userId
        delData.push(select.id)
      })
      // const data = {}
      // data.ids = delData
      deleteVan({ 'ids': delData }).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(error => {
        console.error(error)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    getTag(state) {
      if (state === 0) {
        return 'success'
      } else if (state === 1) {
        return 'danger'
      } else {
        return 'info'
      }
    }
  }
}
</script>
