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
              <router-link to="/configuracoes" class="nav-link text-white">
                Configurações
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/suporte" class="nav-link text-white active">
                Suporte
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Conteúdo principal -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div
          class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
        >
          <h1 class="h2">Central de Suporte</h1>
        </div>

        <!-- Tutoriais -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Tutoriais e Guias</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div
                v-for="tutorial in tutorials"
                :key="tutorial.id"
                class="col-md-4 mb-3"
              >
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">{{ tutorial.title }}</h5>
                    <p class="card-text">{{ tutorial.description }}</p>
                    <div class="d-flex gap-2">
                      <a
                        v-if="tutorial.videoUrl"
                        :href="tutorial.videoUrl"
                        target="_blank"
                        class="btn btn-primary"
                      >
                        <i class="bi bi-play-circle"></i> Ver Vídeo
                      </a>
                      <a
                        v-if="tutorial.documentUrl"
                        :href="tutorial.documentUrl"
                        target="_blank"
                        class="btn btn-outline-primary"
                      >
                        <i class="bi bi-file-text"></i> Ver Documento
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Perguntas Frequentes</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <select class="form-select" v-model="selectedCategory">
                <option value="Todos">Todas as Categorias</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="accordion" id="faqAccordion">
              <div
                v-for="faq in filteredFaqs"
                :key="faq.id"
                class="accordion-item"
              >
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="'#faq-' + faq.id"
                  >
                    {{ faq.question }}
                  </button>
                </h2>
                <div
                  :id="'faq-' + faq.id"
                  class="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulário de Contato -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Contato com Suporte</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitContactForm">
              <div class="mb-3">
                <label for="name" class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="contactForm.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="contactForm.email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="subject" class="form-label">Assunto</label>
                <input
                  type="text"
                  class="form-control"
                  id="subject"
                  v-model="contactForm.subject"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="priority" class="form-label">Prioridade</label>
                <select
                  class="form-select"
                  id="priority"
                  v-model="contactForm.priority"
                >
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">Mensagem</label>
                <textarea
                  class="form-control"
                  id="message"
                  rows="5"
                  v-model="contactForm.message"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  documentUrl?: string;
}

const contactForm = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
  priority: "normal",
});

const faqs = ref<FAQ[]>([
  {
    id: 1,
    category: "Geral",
    question: "Como faço login no sistema?",
    answer:
      'Para fazer login, acesse a página inicial e insira seu e-mail e senha cadastrados. Se esqueceu sua senha, clique em "Esqueci minha senha" para recuperá-la.',
  },
  {
    id: 2,
    category: "Pedidos",
    question: "Como criar um novo pedido de serviço?",
    answer:
      'Na tela principal, clique no botão "Novo Pedido", preencha as informações necessárias como descrição, localização e prioridade, e clique em "Enviar".',
  },
  {
    id: 3,
    category: "Técnicos",
    question: "Como atualizar o status de um serviço?",
    answer:
      'Acesse o pedido em questão, clique em "Atualizar Status" e selecione o novo status do serviço. Não se esqueça de adicionar um comentário quando necessário.',
  },
  {
    id: 4,
    category: "Relatórios",
    question: "Como exportar relatórios?",
    answer:
      "Na tela de relatórios, selecione o período desejado e utilize os botões de exportação para PDF ou Excel disponíveis no topo da página.",
  },
]);

const tutorials = ref<Tutorial[]>([
  {
    id: 1,
    title: "Primeiros Passos",
    description: "Aprenda as funcionalidades básicas do sistema",
    videoUrl: "https://exemplo.com/video1",
    documentUrl: "https://exemplo.com/doc1",
  },
  {
    id: 2,
    title: "Gerenciamento de Pedidos",
    description: "Como criar e gerenciar pedidos de serviço",
    videoUrl: "https://exemplo.com/video2",
    documentUrl: "https://exemplo.com/doc2",
  },
  {
    id: 3,
    title: "Relatórios e Análises",
    description: "Guia completo sobre relatórios e métricas",
    videoUrl: "https://exemplo.com/video3",
    documentUrl: "https://exemplo.com/doc3",
  },
]);

const submitContactForm = () => {
  // Aqui seria implementada a lógica para enviar o formulário
  alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
  contactForm.value = {
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal",
  };
};

const categories = [...new Set(faqs.value.map((faq) => faq.category))];
const selectedCategory = ref("Todos");

const filteredFaqs = computed(() => {
  if (selectedCategory.value === "Todos") {
    return faqs.value;
  }
  return faqs.value.filter((faq) => faq.category === selectedCategory.value);
});
</script>

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

.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.accordion-button:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
