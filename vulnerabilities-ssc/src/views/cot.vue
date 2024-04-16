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
            <el-aside width="300px">
                <el-tree
                :data="currentPageData"
                node-key="dependency"
                accordion
                highlight-current
                @check-change="handleCheckChange"
                @node-click="handleNodeClick"
                style="margin-bottom:50px;"
                ></el-tree>
            </el-aside>
            <el-main>
              <div v-if="!selectedPackageId">
                <p class="no-data-msg">Please select a package ID to view its details.</p>
                <div class="image-container">
                    <img src="../assets/dataset/img2.jpeg">
                </div>
              </div>
              <ul v-else-if="renderedData.length > 0">
                <li v-for="(dataItem, index) in renderedData" :key="index">
                  <div class="info-container">
                    <span><strong>影响的CVE ID:</strong></span>
                    <span>{{ dataItem.cveId }}</span>
                    <span style="margin-left: 30px;"><strong>被影响的版本:</strong></span>
                    <span>{{ dataItem.affectedVersions.join(', ') }}</span>
                  </div>
                </li>
              </ul>
              <div v-else>
                <p class="no-data-msg">There is no impact on the CVE ID and affected version of the warehouse.</p>
                <div class="image-container">
                    <img src="../assets/dataset/img3.jpeg">
                </div>
              </div>
            </el-main>
        </el-container>
        <el-pagination
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            background
            layout="prev, pager, next"
            :total="totalCWEIds"
            style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;"
        ></el-pagination>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed} from 'vue'
  import { useRouter } from 'vue-router';
  import Vdata from '../assets/dataset/packages.json';
  import Adata from '../assets/dataset/cve_affected_packages.json';
  
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

  const handleSelect = (index: any) => {
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
  
  const renderedData = ref([]);

  const selectedPackageId = ref('');

  const handleNodeClick = (data: { id: string }) => {
    selectedPackageId.value = data.id;

    const packageId = data.id;

    const affectedData = [];

    for (const cveId in Adata) {
      if (packageId in Adata[cveId]) {
        const affectedVersions = Adata[cveId][packageId];
        affectedData.push({
          cveId,
          affectedVersions,
        });
      }
    }

    // 将数据赋值给 renderedData
    renderedData.value = affectedData;
  };

    const handleCheckChange = (data: any) => {
        console.log('Checked nodes:', data);
    };

    const handlePageChange = (page: any) => {
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

  .image-container{
    display: flex;
    justify-content: center;
  }
  
  .logo{
    width: 60px;
    height: 50px;
  }
  
  .no-data-msg {
    text-align: center; 
    font-size: 20px; 
    font-weight: bold; 
    color: black;
  }

  .info-container {
    display: flex;
    align-items: center;
  }

  </style>