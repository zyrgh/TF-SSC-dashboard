<template>
    <div class="SSC-graph">
      <span style="font-size: 30px; color: #4B0082;">packages</span>
      <SSC></SSC>
    </div>
    <div class="table-box">
      <!-- 下拉菜单，用于选择漏洞列表和packages列表 -->
      <div class="dropdown">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" color="#fff">
            Dropdown List
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">vulnerablilities</el-dropdown-item>
              <el-dropdown-item command="b">Packages</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 表格，展示数据 -->
      <div class="table">
        <el-table :data="currentPageData" stripe style="width: 100%">
          <el-table-column prop="Pack ID" label="Packages" width="280" />
          <el-table-column prop="Dependent Of" label="Dependent of" width="480" />
          <el-table-column prop="Release" label="Versions" />
        </el-table>
      </div>
      <!-- 分页栏 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="tableData.length"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import SSC from '../components/SSC-d3.vue';
  import { ref, computed } from 'vue';
  import { ArrowDown } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  //下拉框事件
  const handleCommand = (command: string) => {
    if (command === 'a') {
      router.push('/vulnerabilities');
    }
  };
  
  //分页设置
  const currentPage = ref(1);
  const pageSize = ref(10);
  
  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
  };
  
  // 定义tableData作为ref响应式对象
  const tableData = ref([]);
  
  // 通过异步请求加载JSON文件并更新tableData
  const loadPackageData = async () => {
    try {
      const response = await fetch('packages.json');
      const jsonData = await response.json();
      tableData.value = jsonData;
    } catch (error) {
      console.error('Error loading packages.json:', error);
    }
  };
  
  // 在组件挂载后调用loadPackageData
  loadPackageData();
  
  // 根据当前页码和每页显示数量计算当前页的数据
  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
  });
  
  </script>
  
  <style lang="scss" scoped>
  .SSC-graph {
    text-align: center;
  }
  
  .table-box {
    max-width: 1200px;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    position: relative;
  }
  
  .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  </style>