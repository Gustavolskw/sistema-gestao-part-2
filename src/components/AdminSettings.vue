<script setup lang="ts">
import { ref } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

const users = ref<User[]>([
  { id: 1, name: 'João Silva', email: 'joao@exemplo.com', role: 'técnico', status: 'ativo' },
  { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com', role: 'administrador', status: 'ativo' },
  { id: 3, name: 'Carlos Oliveira', email: 'carlos@exemplo.com', role: 'cliente', status: 'inativo' },
]);

const permissions = ref<Permission[]>([
  { id: 1, name: 'Gerenciar Usuários', description: 'Criar, editar e remover usuários', enabled: true },
  { id: 2, name: 'Gerenciar Permissões', description: 'Configurar permissões do sistema', enabled: true },
  { id: 3, name: 'Visualizar Relatórios', description: 'Acessar relatórios do sistema', enabled: true },
]);

const notificationSettings = ref({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
});

const newUser = ref({
  name: '',
  email: '',
  role: 'técnico',
  status: 'ativo'
});

const addUser = () => {
  users.value.push({
    id: users.value.length + 1,
    ...newUser.value
  });
  newUser.value = {
    name: '',
    email: '',
    role: 'técnico',
    status: 'ativo'
  };
};

const removeUser = (id: number) => {
  users.value = users.value.filter(user => user.id !== id);
};

const togglePermission = (permission: Permission) => {
  permission.enabled = !permission.enabled;
};

const saveNotificationSettings = () => {
  // Aqui seria implementada a lógica para salvar as configurações
  alert('Configurações de notificação salvas com sucesso!');
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
              <router-link to="/relatorios" class="nav-link text-white">
                Relatórios
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/configuracoes" class="nav-link text-white active">
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
          <h1 class="h2">Configurações Administrativas</h1>
        </div>

        <!-- Gerenciamento de Usuários -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Gerenciamento de Usuários</h3>
          </div>
          <div class="card-body">
            <!-- Formulário de Novo Usuário -->
            <form @submit.prevent="addUser" class="mb-4">
              <div class="row g-3">
                <div class="col-md-3">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="newUser.name" 
                    placeholder="Nome"
                    required
                  >
                </div>
                <div class="col-md-3">
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="newUser.email" 
                    placeholder="Email"
                    required
                  >
                </div>
                <div class="col-md-2">
                  <select class="form-select" v-model="newUser.role">
                    <option value="técnico">Técnico</option>
                    <option value="administrador">Administrador</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select class="form-select" v-model="newUser.status">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <button type="submit" class="btn btn-primary w-100">Adicionar</button>
                </div>
              </div>
            </form>

            <!-- Lista de Usuários -->
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                      <span :class="user.status === 'ativo' ? 'text-success' : 'text-danger'">
                        {{ user.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="removeUser(user.id)">
                        Remover
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Configuração de Permissões -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Configuração de Permissões</h3>
          </div>
          <div class="card-body">
            <div class="list-group">
              <div v-for="permission in permissions" :key="permission.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="mb-1">{{ permission.name }}</h5>
                    <p class="mb-1 text-muted">{{ permission.description }}</p>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :id="'permission-' + permission.id"
                      v-model="permission.enabled"
                      @change="togglePermission(permission)"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuração de Notificações -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Configuração de Notificações</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveNotificationSettings">
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailNotifications"
                    v-model="notificationSettings.emailNotifications"
                  >
                  <label class="form-check-label" for="emailNotifications">
                    Notificações por E-mail
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="smsNotifications"
                    v-model="notificationSettings.smsNotifications"
                  >
                  <label class="form-check-label" for="smsNotifications">
                    Notificações por SMS
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="pushNotifications"
                    v-model="notificationSettings.pushNotifications"
                  >
                  <label class="form-check-label" for="pushNotifications">
                    Notificações Push
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                Salvar Configurações
              </button>
            </form>
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