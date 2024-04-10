<template>
  <el-container class="home_container">
      <el-header>
          <div>
              <img class="logo" src="../assets/dataset/AI.jpg" alt="">
              <span>VULNPROP</span>
          </div>
      </el-header>
      <el-menu
          :default-active="activerIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
      >
          <el-menu-item index="1">Home</el-menu-item>
          <el-menu-item index="2">CWE</el-menu-item>
          <el-menu-item index="3">chain of transmission</el-menu-item>
          <el-menu-item index="4">About</el-menu-item>
      </el-menu>
      <div class="SSC-graph">
        <SSC></SSC>
      </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import SSC from '../components/SSC-d3.vue';

const activerIndex = ref('1')
const router = useRouter();

const handleSelect = (index) => {
switch (index) {
  case '2':
    router.push('/cwe');
    break;
  case '3':
    router.push('/cot');
    break;
  case '4':
      router.push('/about');
      break;
}
};

</script>

<style >

.flex-grow{
  flex-grow:1;
}


.SSC-graph{
  display: flex;
  justify-content: center;
  align-items: center;
}

.home_container{
  height:50em;
}

.el-header{
  background-color: #5884c6;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 30px;
  >div{
      display: flex;
      align-items: center;
      span{
          margin-left: 15px;
      }
  }
}

.logo{
  width: 60px;
  height: 50px;
}



</style>