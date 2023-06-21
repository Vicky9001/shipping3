<template>
  <div class="container">
    <el-card class="box-card1" style="margin-top:20px;margin-bottom: 20px">
      <h1 class="title" style="margin: 30px;">物流系统</h1>
      <div>
        <p class="subtitle" style="margin-left: 81px; margin-right: 81px">本系统可以实现创建物流订单、分配订购车辆。</p>
      </div>
      <div>
        <img src="@/views/dashboard/image/img_5.png" alt="UI Storyboard" class="image">
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  max-height: 1300px;
  padding: 20px;
  text-align: center;
  margin: 0 auto 40px;
}

.title {
  font-family: 微软雅黑;
  font-size: 24px;
  font-weight: bold;
  color: #032f5a;
  margin-bottom: 10px;
}

.subtitle {
  font-family: 华文中宋;
  font-size: 15px;
  letter-spacing: 3px;
  line-height: 25px;
  color: #3a3d3d;
  margin-bottom: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 280px;
}
.box-card {
  width: 400px;
  height: 300px;
}
.box-card1 {
  width: 960px;
  height: 600px;
  margin: 0 auto;
}

.image {
  max-width: 40%;
  max-height: 40%;
  object-fit: cover;
}
.image1 {
  max-width: 80%;
  max-height: 80%;
  object-fit: cover;
}
.image2 {
  max-width: 90%;
  max-height: 90%;
  object-fit: cover;
}
.image3 {
  max-width: 65%;
  max-height: 40%;
  object-fit: cover;
}
</style>
