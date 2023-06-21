<template>
  <div class="app-container">
    <div style="margin: 10px 0">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 160px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.realName" placeholder="真实姓名" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      fit
      highlight-current-row
      style="width: 90% ;margin-top:20px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="账号名称" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID" min-width="160" align="center" HIDDEN="true">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.entryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
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
      <el-form ref="temp" :model="temp" :rules="rules" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus === '编辑'" label="id" prop="userId">
          <el-input v-model="temp.userId" :disabled="true" />
        </el-form-item>
        <el-form-item label="账号名称" prop="userName">
          <el-input v-model="temp.userName" placeholder="请输入账号名称" :maxlength="20" :pattern="pattern.userName" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="temp.realName" placeholder="请输入真实姓名" :maxlength="4" :pattern="pattern.realName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" :minlength="6" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机号" :maxlength="11" :pattern="pattern.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入职日期" prop="entryTime">
          <el-date-picker v-model="temp.entryTime" type="date" placeholder="选择入职日期" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="选择出生日期">
          </el-date-picker>
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
import { addCarrier, deleteUser, getCarrierList, updateCarrier } from '@/api/user'

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      rules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { max: 20, message: '用户名长度不能超过20个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, trigger: 'blur', message: '请输入真实姓名' },
          { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '真实姓名必须为中文，且长度在2-4个字符之间', trigger: 'blur' }
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        sex: [{ required: true, trigger: 'blur' }],
        phone: [
          { required: true, trigger: 'blur', message: '请输入手机号码' },
          { pattern: /^\d{11}$/, message: '手机号码必须为11位数字', trigger: 'blur' }
        ],
        entryTime: [{ required: true, trigger: 'blur' }],
        birthday: [{ required: true, trigger: 'blur' }]
      },
      listQuery: {
        userName: '',
        realName: ''
      },
      temp: {
        userId: '',
        userName: '',
        realName: '',
        password: '',
        phone: '',
        sex: '0',
        entryTime: '',
        birthday: ''
      },
      roleIds: '',
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
      options: [],
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
      getCarrierList(this.listQuery).then(response => {
        // console.log(this.listQuery)
        response.data.carrierList.forEach(item => {
          const data = {}
          data.userId = item.id
          data.userName = item.username
          data.realName = item.realName
          data.phone = item.phone
          data.entryTime = item.entryTime
          data.birthday = item.birthday
          data.sex = item.sex
          if (data.sex === 0) {
            data.sex = '男'
          } else {
            data.sex = '女'
          }
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
        userId: '',
        userName: '',
        realName: '',
        password: '',
        phone: '',
        sex: '',
        entryTime: '',
        birthday: ''
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
          addCarrier({
            username: this.temp.userName,
            realName: this.temp.realName,
            password: this.temp.password,
            phone: this.temp.phone,
            sex: this.temp.sex,
            entryTime: this.temp.entryTime,
            birthday: this.temp.birthday
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
      this.temp.sex = row.sex === '男' ? '0' : '1'
      alert(JSON.stringify(this.temp))
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
          const entryTime = new Date(this.temp.entryTime).toISOString().substring(0, 10);
          const birthday = new Date(this.temp.birthday).toISOString().substring(0, 10);
          updateCarrier({
            id: this.temp.userId,
            username: this.temp.userName,
            realName: this.temp.realName,
            password: this.temp.password,
            phone: this.temp.phone,
            sex: this.temp.sex,
            entryTime: entryTime,
            birthday: birthday
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
        delData.push(select.userId)
      })
      // const data = {}
      // data.ids = delData
      deleteUser({ 'ids': delData }).then(response => {
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
    }
  }
}
</script>
