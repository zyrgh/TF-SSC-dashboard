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
            <el-menu-item index="3">Chain Of Transmission</el-menu-item>
            <el-menu-item index="4">About</el-menu-item>
        </el-menu>
        <el-container>
          <el-main>
            <p class="title">介绍</p></br>
            <p></p>
          </el-main>
        </el-container>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router';
  
  const activerIndex = ref('4')
  const router = useRouter();
  
  const handleSelect = (index: any) => {
  switch (index) {
    case '1':
      router.push('/home');
      break;
    case '2':
      router.push('/cwe');
      break;
    case '3':
      router.push('/cot');
      break;
  }
  };
  
  </script>
  
  <style >
  
  .flex-grow{
    flex-grow:1;
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
  
  .title {
    text-align: center; 
    font-size: 20px; 
    font-weight: bold; 
    color: black;
  }
  </style>