<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img class="logo" src="../assets/dataset/AI.jpg" alt="">
        <span>VULNPROP</span>
      </div>
    </el-header>
    <el-menu :default-active="activerIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
      @select="handleSelect">
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="2">CWE</el-menu-item>
      <el-menu-item index="3">Chain Of Transmission</el-menu-item>
      <el-menu-item index="4">About</el-menu-item>
    </el-menu>
    <el-container>
      <el-main>
        <p class="title">Introduction</p></br>
        <div class="introcuction">
          <el-card>
            <!-- <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p> -->
            <p>This system shows the research results of TensorFlow vulnerability exploration, including the potential
            propagation network of TensorFlow vulnerabilities, the specific information of each vulnerability, the risk
            version of the application and the upstream vulnerability information of TensorFlow-based software supply chain (SSC).</p>
            <el-divider />

            <p style="font-weight: bold;">Propagation Network of Vulnerabilities</p>
            <p>As a popular deep learning framework, TensorFlow is widely used in a variety of deep learning applications and software 
              packages, which further serve more applications, and gradually form a TensorFlow-based software supply chain. The software 
              packages on the TensorFlow-based SSC that can be propagated by vulnerabilities constitute a TensorFlow vulnerability propagation network.</p>
            <p>The vulnerability propagation network we built spread software packages in four layers with TensorFlow as the starting point. 
              The four layers involved 374, 256, 59, and 2 affected software packages respectively. 
              See the vulnerability propagation network diagram on the <router-link to="/">Home</router-link> page for details.</p>
            <el-divider />

            <p style="font-weight: bold;">Vulnerability Specific Information</p>
            <p>We explore 132 TensorFlow vulnerabilities and analyze their specific information, including the disclosure time of the 
              vulnerability, the fixing commit and the inducing commit. We classify vulnerabilities according to their CWE type, 
              see the <router-link to="/cwe">CWE</router-link> page for details. </p>
            <el-divider />

            <p style="font-weight: bold;">Software Packages on TensorFlow-based Software Supply Chain</p>
            <p>We additionally show information about packages on TensorFlow-based SSC, including the versions of those packages that 
              may be affected by TensorFlow vulnerabilities and the corresponding TensorFlow vulnerabilities. 
              See the <router-link to="/cot">packages</router-link> page for details. </p>
          </el-card>
        </div>
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

<style>
.flex-grow {
  flex-grow: 1;
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

  >div {
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

.title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.introcuction {
  width: 60%;
  margin: 0 auto;
  padding: 20px
}
</style>