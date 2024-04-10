<template>
    <div class="SSC-graph">
      <SSC></SSC>
      <div class="info-bode">
        <div class="title">
          <span class="title">The Informatin Of Packages</span>
        </div>
        <div class="info-text">
          <p>该页面由以下几个主要部分组成：</p>
        <p>1.左侧的动图展示了漏洞的传播供应链。每个节点代表一个仓库，节点之间的连接表示仓库之间的依赖关系。这个动图可以帮助您直观地了解仓库之间的关系和漏洞的传播路径。</p>
        <p>2.信息框的主体部分是一个表格，每一行表示一个仓库的信息，包含了三列：Packages、Dependent of和Versions，它们分别代表仓库的名称、该仓库的依赖仓库以及仓库的版本信息</p>
        <p>3.在信息框的左上侧有一个下拉菜单，您可以在packages和vulnerabilities两种信息之间切换</p>
        <p>通过这个页面，您可以直观地了解仓库之间的依赖关系和漏洞传播的供应链路径。您可以根据需要浏览不同页码的仓库信息，并查看每个仓库的名称、依赖关系和版本信息。</p>
        </div>
      </div>
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
  import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
  import { ArrowDown } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  //下拉框事件
  const handleCommand = (command: string) => {
    if (command === 'a') {
      router.push('/vulnerabilities');
    }
    if (command == 'b'){
        alert("packages网页已经打开，请勿重复打开！")
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

  //在组件销毁前移除键盘事件监听
  onBeforeUnmount(() => {
    document.removeEventListener('keyup',handleKeyUp);
  });
  
  // 根据当前页码和每页显示数量计算当前页的数据
  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
  });

  //键盘事件处理程序
  const handleKeyUp = (event: KeyboardEvent) => {
    if(event.keyCode === 13||event.key === 'Enter'){
      window.scrollTo({
        top:0,
        behavior:'smooth'
      });
    }
  };
  
  // 添加键盘事件监听
  onMounted(()=>{
    document.addEventListener('keyup',handleKeyUp);
  });

  </script>
  
  <style lang="scss" scoped>
  .SSC-graph {
    margin-left: 70px;
    text-align: left;
    display: flex;
    align-items: flex-start; 
  }

  .info-body { 
    padding: 5px; 
    border-radius: 4px;
    white-space: pre-wrap;
    width: 650px; 
  }

  .info-text{
    text-indent: 2em;
    width: 650px; 
  }

  .title{
    text-align: center;
    font-size: 40px;
    color: #4B0082;
    width: 650px; 
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