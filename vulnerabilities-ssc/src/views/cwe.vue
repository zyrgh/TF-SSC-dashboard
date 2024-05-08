<template>
  <el-container class="home_container" >
    <div class="header-wrapper">
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
      <el-input v-model="searchCVE" placeholder="Enter CVE ID" @keydown.enter="handleSearch">
        <template #append>
          <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        </template>
      </el-input>
    </div>
    <el-container>
      <el-aside width="250px">
        <el-tree
          :data="currentPageData"
          node-key="CWEId"
          accordion
          highlight-current
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-aside>
      <el-main>
        <div v-if="selectedCVE">
          <h2 style="text-align: center;">{{ selectedCVE['CVE ID'] }}</h2>
          <p><strong>Description:</strong>{{ selectedCVE['Description'] }}</p>
          <p><strong>Base Score: </strong>{{ selectedCVE['Base Score'] }}</p>
          <p><strong>Severity Vector: </strong>{{ selectedCVE['Severity Vector'] }}</p>
          <p><strong>Published Date: </strong>{{ selectedCVE['Published Date'] }}</p>
          <p><strong>Last Modified: </strong>{{ selectedCVE['Last Modified'] }}</p>
          <p><strong>Change module: </strong>{{ selectedCVE['Change module'] }}</p>
          <p><strong>Commit: </strong>{{ selectedCVE['Commit'] }}</p>
          <p><strong>Commit Date: </strong>{{ selectedCVE['Commitdate'] }}</p>
          <p><strong>Introducing Commit: </strong>{{ selectedCVE['Introducing commit'] }}</p>
          <p><strong>Introducing Date: </strong>{{ selectedCVE['Introducing date'] }}</p>
          <div class="SSC-graph">
            <SSC :selected-cve="selectedCveId"></SSC>
          </div>
        </div>
      <div v-else>
        <p style="text-align: center; font-size: 20px; font-weight: bold; color: black;">
          Please select a CVE ID to view its details.
        </p>
        <div class="image-container">
            <img src="../assets/dataset/CWE-tree.png">
        </div>
        <p>
          The hierarchy of CWE corresponding to the TensorFlow vulnerability. The red node is the CWE ID that directly corresponds to the CVEs of TensorFlow.
        </p>
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
      style="position: fixed; bottom: 0; left: 0; right: 0;"
    ></el-pagination>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed} from 'vue';
import { useRouter } from 'vue-router';
import Vdata from '../assets/dataset/vulnerabilities.json';
import SSC from '../components/SSC-d3.vue';

const currentPage = ref(1); 
const pageSize = 25; 

const categorizedData = computed(() => {
  const categorized: { [key: string]: { CWEId: string, CVEIds: string[] } } = {};

  Vdata.forEach(item => {
    const CWEIds = item['CWE ID'] ? item['CWE ID'].split(',').map(id => id.trim()) : [];
    const CVEId = item['CVE ID'];

    CWEIds.forEach(CWEId => {
      if (!categorized[CWEId]) {
        categorized[CWEId] = {
          CWEId,
          CVEIds: []
        };
      }

      categorized[CWEId].CVEIds.push(CVEId);
    });
  });

  // 对CVEIds进行排序
  for (const key in categorized) {
    const cveIds = categorized[key].CVEIds;
    cveIds.sort((a, b) => {
      const introducingDateA = Vdata.find(item => item['CVE ID'] === a)['Introducing date'];
      const introducingDateB = Vdata.find(item => item['CVE ID'] === b)['Introducing date'];

      return new Date(introducingDateA).getTime() - new Date(introducingDateB).getTime();
    });
  }

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
    const CVEIds = categorizedData.value[key].CVEIds;
    const children = CVEIds.map(CVEId => ({ id: CVEId, label: CVEId }));

    return { CWEId, label: CWEId, children };
  });
});

const activerIndex = ref('2');
const router = useRouter();

const handleSelect = (index: any) => {
  switch (index) {
    case '1':
      router.push('/home');
      break;
    case '3':
      router.push('/cot');
      break;
    case '4':
      router.push('/about');
      break;
  }
};

const selectedCVE = ref(null);
const selectedCveId = ref(null);
const handleNodeClick = (data: { id: any; }) => {
  const cveId = data.id;
  selectedCVE.value = Vdata.find((item) => item['CVE ID'] === cveId);
  selectedCveId.value = cveId;
};



const handleCheckChange = (data: any) => {
  console.log('Checked nodes:', data);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const searchCVE = ref('');

const handleSearch = () => {
  const cveId = searchCVE.value.toLowerCase();
  const foundCVE = Vdata.find((item) => item['CVE ID'].toLowerCase().includes(cveId));

  if (foundCVE) {
    selectedCVE.value = foundCVE;
  } else {
    selectedCVE.value = null;
    alert('CVE ID not found. Please enter a valid CVE ID.');
  }
};
</script>

<style scoped>

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.el-container {
  margin-top: 80px;
}

.image-container{
  display: flex;
  justify-content: center;
  width: 90%;
  height: auto;
}

.image-container img{
  max-width: 100%;
  height: auto;
}

.flex-grow {
  flex-grow: 1;
}

.SSC-graph {
  margin-left: 70px;
  text-align: left;
  display: flex;
  align-items: flex-start;
}

.home_container {
  height: 50em;
}

.el-header {
  background-color: #5884c6;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 30px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.logo {
  width: 60px;
  height: 50px;
}

</style>