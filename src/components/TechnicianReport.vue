<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const startDate = ref('');
const endDate = ref('');
const selectedTechnician = ref('all');
const selectedCompany = ref('all');
const selectedStatus = ref('all');

// Dados mock para filtros
const technicians = [
  { id: 1, name: 'Técnico 1' },
  { id: 2, name: 'Técnico 2' },
  { id: 3, name: 'Técnico 3' },
  { id: 4, name: 'Técnico 4' }
];

const companies = [
  { id: 1, name: 'Empresa A' },
  { id: 2, name: 'Empresa B' },
  { id: 3, name: 'Empresa C' }
];

const orderStatuses = [
  { value: 'completed', label: 'Concluídos' },
  { value: 'pending', label: 'Pendentes' }
];

// Dados mock com status
const orders = ref([
  { id: 1, technician: 'Técnico 1', company: 'Empresa A', status: 'completed', date: '2024-01-01' },
  { id: 2, technician: 'Técnico 2', company: 'Empresa B', status: 'pending', date: '2024-01-02' },
  // Adicionar mais pedidos mock conforme necessário
]);

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchTechnician = selectedTechnician.value === 'all' || order.technician === selectedTechnician.value;
    const matchCompany = selectedCompany.value === 'all' || order.company === selectedCompany.value;
    const matchStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value;
    return matchTechnician && matchCompany && matchStatus;
  });
});

// Dados de desempenho baseados nos pedidos filtrados
const performanceData = computed(() => {
  const completed = filteredOrders.value.filter(order => order.status === 'completed').length;
  return {
    totalOrders: filteredOrders.value.length,
    completedOrders: completed,
    pendingOrders: filteredOrders.value.length - completed,
    averageTime: '2,5 horas' // Seria calculado a partir de dados reais
  };
});

const lineChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Pedidos Concluídos',
    data: [65, 59, 80, 81, 56, 55],
    borderColor: '#0d6efd',
    tension: 0.1
  }]
};

const barChartData = {
  labels: ['Técnico 1', 'Técnico 2', 'Técnico 3', 'Técnico 4'],
  datasets: [{
    label: 'Tempo Médio de Resposta (horas)',
    data: [2.5, 1.8, 3.2, 2.1],
    backgroundColor: '#0d6efd'
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Relatório de Desempenho dos Técnicos', 20, 20);
  doc.text(`Período: ${startDate.value} a ${endDate.value}`, 20, 30);
  doc.text(`Total de Pedidos: ${performanceData.value.totalOrders}`, 20, 40);
  doc.text(`Pedidos Concluídos: ${performanceData.value.completedOrders}`, 20, 50);
  doc.text(`Tempo Médio: ${performanceData.value.averageTime}`, 20, 60);
  doc.save('relatorio-tecnicos.pdf');
};

const exportToExcel = () => {
  const data = [
    ['Relatório de Desempenho dos Técnicos'],
    [`Período: ${startDate.value} a ${endDate.value}`],
    ['Total de Pedidos', performanceData.value.totalOrders],
    ['Pedidos Concluídos', performanceData.value.completedOrders],
    ['Tempo Médio', performanceData.value.averageTime]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  XLSX.writeFile(wb, 'relatorio-tecnicos.xlsx');
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Barra lateral -->
      <nav class="col-md-3 col-lg-2 d-md-block bg-primary sidebar collapse">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/relatorios" class="nav-link text-white active">
                Relatórios
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/configuracoes" class="nav-link text-white">
                Configurações
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/suporte" class="nav-link text-white">
                Suporte
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Conteúdo principal -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2 text-dark">Relatório de Desempenho dos Técnicos</h1>
        </div>

        <!-- Filtros -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text">Data Inicial</span>
              <input type="date" class="form-control" v-model="startDate">
            </div>
          </div>
          <div class="col-md-3">
            <div class="input-group">
              <span class="input-group-text">Data Final</span>
              <input type="date" class="form-control" v-model="endDate">
            </div>
          </div>
          <div class="col-md-6">
            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="exportToPDF">
                Exportar PDF
              </button>
              <button class="btn btn-outline-primary" @click="exportToExcel">
                Exportar Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Filtros Adicionais -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">Técnico</span>
              <select class="form-select" v-model="selectedTechnician">
                <option value="all">Todos os Técnicos</option>
                <option v-for="tech in technicians" :key="tech.id" :value="tech.name">
                  {{ tech.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">Empresa</span>
              <select class="form-select" v-model="selectedCompany">
                <option value="all">Todas as Empresas</option>
                <option v-for="company in companies" :key="company.id" :value="company.name">
                  {{ company.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">Status</span>
              <select class="form-select" v-model="selectedStatus">
                <option value="all">Todos os Pedidos</option>
                <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Cartões de Resumo -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Total de Pedidos</h5>
                <p class="card-text h3 text-primary">{{ performanceData.totalOrders }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Pedidos Concluídos</h5>
                <p class="card-text h3 text-success">{{ performanceData.completedOrders }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Pedidos Pendentes</h5>
                <p class="card-text h3 text-warning">{{ performanceData.pendingOrders }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Tempo Médio</h5>
                <p class="card-text h3 text-primary">{{ performanceData.averageTime }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Pedidos ao Longo do Tempo</h5>
                <div style="height: 300px">
                  <Line :data="lineChartData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-dark">Tempo Médio de Resposta por Técnico</h5>
                <div style="height: 300px">
                  <Bar :data="barChartData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>