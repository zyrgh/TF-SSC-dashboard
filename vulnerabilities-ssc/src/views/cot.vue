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
            <el-aside width="200px">
                <el-tree
                :data="currentPageData"
                node-key="dependency"
                accordion
                highlight-current
                @check-change="handleCheckChange"
                ></el-tree>
            </el-aside>
        </el-container>
        <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            background
            layout="prev, pager, next"
            :total="totalCWEIds"
        ></el-pagination>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed} from 'vue'
  import { useRouter } from 'vue-router';
  import Vdata from '../assets/dataset/packages.json';
  
  const activerIndex = ref('3')
  const router = useRouter();
  
  const currentPage = ref(1); 
  const pageSize = 25; 

  const categorizedData = computed(() => {
  const categorized: { [key: string]: { dependency: string, PACKIds: string[] } } = {};

  Vdata.forEach(item => {
    const DependentOf = item['Dependent Of'];
    const PACKId = item['Pack ID'];
    
    if (DependentOf) {
      DependentOf.forEach(dependency => {
        if (!categorized[dependency]) {
          categorized[dependency] = {
            dependency,
            PACKIds: []
          };
        }
        categorized[dependency].PACKIds.push(PACKId);
      });
    }
  });

  return categorized;
});

const totalCWEIds = computed(() => {
  return Object.keys(categorizedData.value).length;
});

const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  const keys = Object.keys(categorizedData.value).slice(start, end);

  return keys.map(key => {
    const CWEId = key;
    const CVEIds = categorizedData.value[key].PACKIds;
    const children = CVEIds.map(PACKId => ({ id: PACKId, label: PACKId }));

    return { CWEId, label: CWEId, children };
  });
});

  const handleSelect = (index) => {
  switch (index) {
    case '1':
      router.push('/home');
      break;
    case '2':
      router.push('/cwe');
      break;
    case '4':
      router.push('/about');
      break;
    }
  };
  


    const handleCheckChange = (data) => {
        console.log('Checked nodes:', data);
    };

    const handlePageChange = (page) => {
        currentPage.value = page;
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
  
  
  </style>