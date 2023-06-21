<template>
  <div class="app-container">
    <div style="margin: 10px 0">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">
        新增
      </el-button>
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
<!--      <el-table-column type="selection" :reserve-selection="true" width="55" />-->
      <el-table-column label="ID" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发件人" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shipper }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收件人" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起点" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终点" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费/元" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span>
            <el-tag :type="getTag(row.state)">
              {{ row.state==1?'待揽件':(row.state==2?'揽件运输中':(row.state==3?'已交付':(row.state==4?'退货拒收':(row.state==40?'退货待揽件':(row.state==41?'揽件运输中':(row.state==42?'退货交付':'订单结束')))))) }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label=" " prop="detail" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" @click="checkDetail(row)">
            查看详情
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
      style="width: 95% ;margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :title="'创建订单'" :visible.sync="dialogFormVisible">
      <el-form ref="temp" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="发货地" prop="start">
          <el-input v-model="temp.start" />
        </el-form-item>
        <el-form-item label="目的地" prop="start">
          <el-input v-model="temp.destination" />
        </el-form-item>
        <el-form-item label="收件人" prop="start">
          <el-input v-model="temp.receiver" />
        </el-form-item>
        <el-form-item label="重量/kg" prop="start">
          <el-input v-model.number="temp.money" type="number" step="0.01" min="0"/>
        </el-form-item>
        <el-form-item label="信息" prop="start">
          <el-input v-model="temp.info" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createOrder()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--    详情弹窗-->
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <el-descriptions title="详情" direction="vertical" :column="4" border style="width: 90% ">
        <el-descriptions-item label="ID">
          {{ detail.id }}
        </el-descriptions-item>
        <el-descriptions-item label="创建日期">
          {{ detail.createDate }}
        </el-descriptions-item>
        <el-descriptions-item label="发件人">
          {{ detail.shipperUsername }}
        </el-descriptions-item>
        <el-descriptions-item label="发件人电话号码">
          {{ detail.shipperPhone }}
        </el-descriptions-item>
      </el-descriptions>

      <!--运输员-->
      <el-table
        title="'承运人员'"
        :data="detail.carriers"
        border
        fit
        highlight-current-row
        style="width: 540px; margin-top:20px;"
      >
        <el-table-column prop="username" label="用户名" width="180">
          <template slot-scope="{row}">
            {{ row.username }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsInfo" label="真实姓名" width="180">
          <template slot-scope="{row}">
            {{ row.realName }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="180">
          <template slot-scope="{row}">
            {{ row.phone }}
          </template>
        </el-table-column>
      </el-table>

      <!--车辆-->
      <el-table
        title="'运输车辆'"
        :data="detail.vans"
        border
        fit
        highlight-current-row
        style="width: 360px; margin-top:20px;"
      >
        <el-table-column prop="license" label="牌照" width="180">
          <template slot-scope="{row}">
            {{ row.license }}
          </template>
        </el-table-column>
        <el-table-column prop="maxLoad" label="最大载重" width="180">
          <template slot-scope="{row}">
            {{ row.maxLoad }}
          </template>
        </el-table-column>
      </el-table>

      <!--记录-->
      <el-table
        :data="detail.shipments"
        border
        fit
        highlight-current-row
        style="width: 360px; margin-top:20px;"
      >
        <el-table-column prop="transferTime" label="时间" width="180">
          <template slot-scope="{row}">
            {{ row.transferTime }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点" width="180">
          <template slot-scope="{row}">
            {{ row.location }}
          </template>
        </el-table-column>
      </el-table>

      <!--      <el-table-->
      <!--        ref="multipleTable"-->
      <!--        :data="detailRecords.slice((currentPage-1)*pageSize,currentPage*pageSize)"-->
      <!--        border-->
      <!--        fit-->
      <!--        highlight-current-row-->
      <!--        style="width: 90% ;margin-top:20px;"-->
      <!--      >-->
      <!--        <el-table-column prop="remark" label="操作描述" width="240">-->
      <!--          <template slot-scope="{row}">-->
      <!--            {{ row.taskType | opFilter }}-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column prop="operateTime" label="操作日期" width="240">-->
      <!--          <template slot-scope="{row}">-->
      <!--            {{ row.operateTime }}-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column prop="user" label="操作人">-->
      <!--          <template slot-scope="{row}">-->
      <!--            {{ row.user.realName }}-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getOrder, getShipment, getDetail, transfer, create } from '@/api/order'

// function validateVans(rule, value, callback) {
//   const maxCars = this.update.carriers.length // 承运人的数量
//   const maxLoadLimit = 1000 // 最大载重之和的限制
//   if (value.length > maxCars) {
//     callback(new Error('运输车辆数量不能大于承运人数量'))
//   } else {
//     const maxLoadSum = value.reduce((sum, van) => sum + van.maxLoad, 0)
//     if (maxLoadSum < maxLoadLimit) {
//       callback(new Error(`运输车辆的最大载重之和不能小于${maxLoadLimit}`))
//     } else {
//       callback()
//     }
//   }
// }

export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      desc: 'test',
      goodsId: '',
      num: '',
      listQuery: {
        shipperName: this.$store.getters.userName,
        carrierName: '',
        vanLicense: ''
      },
      form: {
        desc: ''
      },
      options: [],
      detail: {
        id: '',
        createDate: '',
        shipperUsername: '',
        shipperPhone: '',
        carriers: [],
        vans: [],
        shipments: []
      },
      temp: {
        shipperId: this.$store.getters.userId,
        start: '',
        destination: '',
        receiver: '',
        weight: '',
        info: ''
      },
      tableData: [],
      multiSelection: [],
      dialogVisible: false,
      dialogFormVisible: false,
      refresh: false,
      rules: {
        start: [
          { required: true, message: '请输入发货地', trigger: 'blur' }
        ],
        destination: [
          { required: true, message: '请输入目的地', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请输入收件人', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入重量', trigger: 'blur' },
          { pattern: /^(\d+|\d+\.\d+)$/, message: '请输入数字或小数', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '请输入信息', trigger: 'blur' }
        ]
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10 // 每页的数据条数
    }
  },
  created() {
    // this.getSuppliers()
    this.getList()
    // this.nowtimer = setInterval(this.gettime, 1000)
  },
  methods: {
    // getRowKeys(row) {
    //   return row.goodsId
    // },
    // getSuppliers() {
    //   console.log(this.$store.getters.userId)
    //   this.suppls = []
    //   getOrder(this.listQuery).then(res => {
    //     res.data.supplierList.forEach(item => {
    //       const data = {}
    //       data.supplierId = item.supplierId
    //       data.supplName = item.supplierName
    //       this.suppls.push(data)
    //     })
    //   })
    //   console.log(this.suppls)
    // },
    getList() {
      this.listLoading = true
      this.tableData = []
      // alert(JSON.stringify(this.$store.getters))
      getOrder(this.listQuery).then(response => {
        response.data.orderList.forEach(item => {
          const data = {}
          data.id = item.id
          data.shipper = item.shipper.username
          data.start = item.start
          data.destination = item.destination
          data.weight = item.weight
          data.money = item.money
          data.receiver = item.receiver
          data.state = item.state
          data.info = item.info
          this.tableData.push(data)
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      // this.getSuppliers()
      this.getList()
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
    // 1-已付款待揽件，2-揽件运输中，3-已交付，4-退货拒收 40-退货待揽件 41-退货运输中 42-退货交付 5-订单结束
    getTag(state) {
      if (state === 1) {
        return 'success'
      } else if (state === 2) {
        return 'danger'
      } else if (state === 3) {
        return 'info'
      } else if (state === 4) {
        return 'warning'
      } else if (state === 40) {
        return 'danger'
      } else if (state === 41) {
        return ''
      } else if (state === 42) {
        return ''
      } else if (state === 5) {
        return ''
      }
    },
    checkDetail(row) {
      // alert(JSON.stringify(row.state))
      const data = {}
      data.orderId = row.id
      getDetail(data).then(response => {
        this.detail.id = response.data.order.id
        this.detail.createDate = response.data.order.createDate
        this.detail.shipperUsername = response.data.order.shipper.username
        this.detail.shipperPhone = response.data.order.shipper.phone
        this.dialogVisible = true
        // this.detail.carriers = response.data.order.carriers
        response.data.order.carriers.forEach(item => {
          const d = {}
          d.id = item.id
          d.username = item.username
          d.realName = item.realName
          d.phone = item.phone
          this.detail.carriers.push(d)
        })
        response.data.order.vans.forEach(item => {
          const d = {}
          d.license = item.license
          d.maxLoad = item.maxLoad
          this.detail.vans.push(d)
        })
        getShipment({ 'orderId': row.id }).then(res => {
          res.data.shipments.forEach(i => {
            const d = {}
            d.transferTime = i.transferTime
            d.location = i.location
            this.detail.shipments.push(d)
          })
        })
      })
    },
    transferForm(row) {
      // alert(JSON.stringify(row))
      this.update.id = row.id
      this.update.loca = ''
      this.dialogFormVisible = true
    },
    handleShip() {
      this.$refs.update.validate(valid => {
        if (valid) {
          transfer(this.update).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Modified  Successfully',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          // 表单验证未通过
          this.$message.error('请填写完整正确的信息')
          return false
        }
      })
    },
    notTransfer(row) {
      if (row.state === 2) {
        // alert('2')
        return false
      }
      if (row.state === 41) {
        // alert('41')
        return false
      }
      // alert('true')
      return true
    },
    createOrder() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          create(this.temp).then(response => {
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
    }
  }
}
</script>
