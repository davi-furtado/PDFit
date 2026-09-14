# PDFit

Sistema web para criação de fichas de treino e avaliações físicas em PDF, desenvolvido para personal trainers.

O PDFit permite preencher os dados de um aluno, montar treinos personalizados e registrar avaliações físicas, gerando os documentos em PDF diretamente no navegador.

A aplicação é uma aplicação estática, sem necessidade de backend, banco de dados ou sistema de autenticação.

## 🎯 Objetivo

Facilitar o trabalho de personal trainers na criação de documentos profissionais para seus alunos, permitindo:

- Criar fichas de treino;
- Definir divisões de treino AB, ABC ou ABCD;
- Adicionar e organizar exercícios;
- Registrar avaliações físicas;
- Adicionar múltiplas imagens;
- Organizar a ordem das imagens;
- Gerar PDFs diretamente no navegador;
- Utilizar a aplicação em computadores, tablets e celulares.

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript
- Bootstrap
- html2pdf.js
- GitHub Pages

### Arquitetura

O PDFit é uma aplicação frontend-only, formada por páginas HTML estáticas e JavaScript puro. Não utiliza Vite ou outro framework de aplicação.

Não haverá:

- Backend;
- API;
- Banco de dados;
- Login;
- Cadastro de usuários;
- Armazenamento permanente de alunos;
- Armazenamento de imagens em servidor.

Os dados serão processados localmente no navegador.

### Estrutura atual do projeto

```text
PDFit/
├── index.html                 # T01 — tela principal
├── treino-novo.html           # T02 — dados iniciais do treino
├── treino-editor.html         # T03 — editor de treino
├── avaliacao.html             # T04 — avaliação física
├── 404.html                   # página de erro do GitHub Pages
├── css/
│   ├── bootstrap.min.css      # Bootstrap local
│   ├── bootstrap-icons.min.css # Bootstrap Icons local
│   ├── fonts/
│   │   └── bootstrap-icons.woff2
│   └── style.css              # estilos da aplicação
├── js/
│   ├── app.js                 # fluxo, estado e geração dos documentos
│   └── html2pdf.bundle.min.js # geração local dos PDFs
├── LICENSE
├── favicon.ico                # ícone da aplicação
└── README.md
```

As telas são arquivos independentes e navegam entre si por links relativos e `location.href`.
O estado temporário do personal e do treino é mantido em `sessionStorage`, sem persistência após o fechamento da sessão do navegador.
O `404.html` utiliza os mesmos caminhos relativos da aplicação e não depende de scripts para montar caminhos de assets.

### Decisões de implementação

- A biblioteca `html2pdf.js` é carregada localmente, sem CDN.
- O PDF do treino é A4 em orientação paisagem.
- O PDF da avaliação física é A4 em orientação retrato.
- Os arquivos são baixados como `PDFit-treino-Nome.pdf` e `PDFit-avaliacao-Nome.pdf`.
- A reordenação de exercícios e imagens é feita por botões de subir e descer.
- O nome do aluno é obrigatório na avaliação; as medidas são opcionais.
- Medidas não preenchidas aparecem como linhas em branco no PDF para preenchimento manual.
- Imagens aceitas: JPG, JPEG e PNG, processadas como dados locais no navegador.
- O modo escuro é o padrão e pode ser alternado para modo claro em todas as telas.
- Bootstrap Icons é carregado localmente e usado nos botões, navegação, ações e estados da aplicação.
- A pré-visualização do PDF acompanha o tema da tela, mas a exportação sempre usa fundo e conteúdo claros.
- A pré-visualização permanece visível antes do download para evitar a geração de uma página vazia.

## 📱 Mapa de Telas

### T01 — Tela Principal

Tela inicial do PDFit.

#### Campos

- Nome do Personal Trainer
- Botão Criar Treino
- Botão Avaliação Física

O nome do personal será utilizado na identificação dos documentos gerados em PDF.

#### Fluxo

```text
T01 — Tela Principal
├── Criar Treino
│   └── T02 — Novo Treino
│       └── T03 — Editor de Treino
│           └── PDF do Treino
└── Avaliação Física
   └── T04 — Avaliação Física
      └── PDF da Avaliação
    ```

## 🏋️ Módulo de Treinos

### T02 — Novo Treino

Tela responsável pelos dados iniciais do treino.

#### Campos

* Nome do aluno
* Divisão do treino
  - `AB`
  - `ABC`
  - `ABCD`

O nome do aluno e a divisão serão definidos antes de entrar no editor.

#### Regras

* O nome do aluno é obrigatório.
* A divisão do treino é obrigatória.
* A quantidade de dias será criada automaticamente de acordo com a divisão escolhida.

| Divisão | Dias |
| --- | --- |
| AB | A, B |
| ABC | A, B, C |
| ABCD | A, B, C, D |

### T03 — Editor de Treino

Tela responsável pela montagem da ficha de treino.

Cada dia possuirá seu próprio conteúdo.

#### Dados do dia

* Título do dia
* Comentário do dia — opcional

Exemplo:

`A: Superiores`

#### Exercícios

Cada dia poderá possuir vários exercícios.

Cada exercício terá:

* Nome;
* Séries;
* Repetições;
* Comentário — opcional.

Exemplo:

```text
1. Supino Reto
   4 séries × 12 repetições
   Comentário:
   Executar com controle do movimento.
```

#### Funcionalidades

- Adicionar exercício;
- Remover exercício;
- Editar exercício;
- Reordenar exercícios;
- Visualizar exercícios cadastrados;
- Trocar entre os dias A, B, C e D;
- Adicionar comentário geral do treino.

A ordem dos exercícios deverá ser mantida no PDF.

#### Comentário geral

O treino poderá possuir um comentário geral opcional.

## 📏 Módulo de Avaliação Física

### T04 — Avaliação Física

Tela responsável pelo registro das medidas e imagens do aluno.

#### Dados do aluno

- Nome do aluno

#### Medidas

- Ombros;
- Tórax;
- Braço direito;
- Braço esquerdo;
- Antebraço direito;
- Antebraço esquerdo;
- Abdômen;
- Cintura;
- Glúteo;
- Perna direita;
- Perna esquerda;
- Panturrilha direita;
- Panturrilha esquerda.

As medidas serão registradas em centímetros (cm).

#### Comentário

A avaliação poderá possuir um comentário geral opcional.

#### Imagens

Será possível adicionar múltiplas imagens à avaliação.

Funcionalidades:

- Adicionar imagens;
- Visualizar prévias;
- Remover imagens;
- Reordenar imagens;
- Manter a ordem definida no PDF.

#### Formatos aceitos

- JPG;
- JPEG;
- PNG.

As imagens serão processadas localmente no navegador.

## 📄 Geração de PDFs

O PDFit deverá gerar dois tipos principais de documentos:

### PDF de Treino

O documento deverá apresentar:

- Nome do personal trainer;
- Nome do aluno;
- Divisão do treino;
- Dias de treino;
- Título de cada dia;
- Comentário do dia;
- Exercícios;
- Séries;
- Repetições;
- Comentários dos exercícios;
- Comentário geral do treino.

A ordem dos exercícios deverá ser preservada.

### PDF de Avaliação Física

O documento deverá apresentar:

- Nome do personal trainer;
- Nome do aluno;
- Medidas corporais;
- Comentário da avaliação;
- Imagens adicionadas;
- Ordem das imagens definida pelo usuário.

Os PDFs serão gerados localmente no navegador, sem envio dos dados para um servidor.

## 📋 Requisitos Funcionais

| ID | Requisito |
| --- | --- |
| RF01 | Permitir informar o nome do personal trainer |
| RF02 | Permitir acessar o módulo de criação de treino |
| RF03 | Permitir acessar o módulo de avaliação física |
| RF04 | Permitir informar o nome do aluno |
| RF05 | Permitir selecionar a divisão AB, ABC ou ABCD |
| RF06 | Criar automaticamente os dias de acordo com a divisão |
| RF07 | Permitir informar o título de cada dia |
| RF08 | Permitir adicionar comentário ao dia |
| RF09 | Permitir adicionar múltiplos exercícios |
| RF10 | Permitir informar nome, séries e repetições do exercício |
| RF11 | Permitir adicionar comentário ao exercício |
| RF12 | Permitir remover exercícios |
| RF13 | Permitir reordenar exercícios |
| RF14 | Permitir adicionar comentário geral ao treino |
| RF15 | Gerar PDF do treino |
| RF16 | Permitir informar o nome do aluno na avaliação |
| RF17 | Permitir informar as medidas físicas |
| RF18 | Permitir adicionar comentário à avaliação |
| RF19 | Permitir adicionar múltiplas imagens |
| RF20 | Permitir visualizar as imagens adicionadas |
| RF21 | Permitir remover imagens |
| RF22 | Permitir reordenar imagens |
| RF23 | Gerar PDF da avaliação física |

## ⚙️ Requisitos Não Funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | A aplicação deverá ser responsiva |
| RNF02 | Deverá funcionar em celulares, tablets e computadores |
| RNF03 | Não deverá depender de backend |
| RNF04 | Os dados deverão ser processados localmente |
| RNF05 | As imagens não deverão ser enviadas para servidores |
| RNF06 | Os PDFs deverão ser gerados localmente |
| RNF07 | A interface deverá ser simples e intuitiva |
| RNF08 | A aplicação deverá funcionar em navegadores modernos |
| RNF09 | A aplicação deverá ser compatível com GitHub Pages |
| RNF10 | O sistema deverá suportar múltiplas imagens |
| RNF11 | A ordem dos exercícios deverá ser preservada no PDF |
| RNF12 | A ordem das imagens deverá ser preservada no PDF |

## 📐 Regras de Negócio

| ID | Regra |
| --- | --- |
| RN01 | O nome do personal será informado na tela principal |
| RN02 | O nome do aluno é obrigatório para criação do treino |
| RN03 | A divisão do treino deve ser selecionada antes do editor |
| RN04 | AB cria os dias A e B |
| RN05 | ABC cria os dias A, B e C |
| RN06 | ABCD cria os dias A, B, C e D |
| RN07 | Cada exercício pertence a um único dia dentro daquele treino |
| RN08 | Um exercício pode ser utilizado em diferentes dias |
| RN09 | A ordem dos exercícios deve ser mantida no PDF |
| RN10 | A reordenação de exercícios ocorre somente dentro do próprio dia |
| RN11 | Nome, séries e repetições são obrigatórios em cada exercício |
| RN12 | Comentários de dia, exercício e treino são opcionais |
| RN13 | As medidas da avaliação são registradas em centímetros |
| RN14 | O comentário da avaliação é opcional |
| RN15 | A avaliação pode possuir múltiplas imagens |
| RN16 | Somente JPG, JPEG e PNG serão aceitos |
| RN17 | A ordem das imagens deve ser mantida no PDF |
| RN18 | Imagens podem ser removidas antes da geração do PDF |
| RN19 | O PDF deve refletir os dados preenchidos no momento da geração |
| RN20 | Os dados não serão persistidos após o fechamento ou atualização da página |
| RN21 | As imagens permanecerão somente no processamento local do navegador |

## 🗃️ Estrutura dos Dados

### Treino

```javascript
{
  personal: "Nome do Personal",
  aluno: "João Silva",
  divisao: "ABC",
  comentarioGeral: "",
  dias: [
    {
      identificador: "A",
      titulo: "Superiores",
      comentario: "",
      exercicios: [
        {
          nome: "Supino Reto",
          series: 4,
          repeticoes: 12,
          comentario: "",
          ordem: 1
        }
      ]
    }
  ]
}
```

### Avaliação Física

```javascript
{
  personal: "Nome do Personal",
  aluno: "João Silva",
  medidas: {
    ombros: "",
    torax: "",
    bracoDireito: "",
    bracoEsquerdo: "",
    antebracoDireito: "",
    antebracoEsquerdo: "",
    abdomen: "",
    cintura: "",
    gluteo: "",
    pernaDireita: "",
    pernaEsquerda: "",
    panturrilhaDireita: "",
    panturrilhaEsquerda: ""
  },
  comentario: "",
  imagens: [
    {
      arquivo: "data:image/png;base64,...",
      nome: "frente.png"
    }
  ]
}
```

## 📊 Backlog

### Sprint 1 — Fundação e Fluxo Principal

- [ ] Criar estrutura inicial do projeto
- [ ] Configurar Bootstrap
- [ ] Criar T01 — Tela Principal
- [ ] Adicionar campo de nome do personal
- [ ] Criar navegação para Treino
- [ ] Criar navegação para Avaliação
- [ ] Criar T02 — Novo Treino
- [ ] Adicionar campo de nome do aluno
- [ ] Adicionar seleção AB/ABC/ABCD
- [ ] Criar dias automaticamente

### Milestone M1 — Fluxo Inicial Funcional

Resultado esperado:

O usuário consegue informar o personal, iniciar um treino, informar o aluno, escolher a divisão e acessar o editor.

### Sprint 2 — Editor de Treino

- [ ] Criar T03
- [ ] Criar abas/dias A, B, C e D
- [ ] Adicionar título do dia
- [ ] Adicionar comentário do dia
- [ ] Adicionar exercícios
- [ ] Informar séries e repetições
- [ ] Adicionar comentário do exercício
- [ ] Remover exercícios
- [ ] Reordenar exercícios
- [ ] Adicionar comentário geral

### Milestone M2 — Editor de Treino Completo

Resultado esperado:

O usuário consegue montar completamente uma ficha de treino.

### Sprint 3 — PDF de Treino e Avaliação Física Base

- [ ] Implementar geração do PDF de treino
- [ ] Incluir nome do personal no PDF
- [ ] Preservar ordem dos exercícios
- [ ] Criar T04
- [ ] Adicionar nome do aluno
- [ ] Adicionar campos de medidas
- [ ] Adicionar comentário da avaliação

### Milestone M3 — Módulo de Treino Concluído

Resultado esperado:

O usuário consegue criar um treino completo e gerar seu PDF.

### Sprint 4 — Imagens e PDF da Avaliação

- [ ] Adicionar múltiplas imagens
- [ ] Criar pré-visualização
- [ ] Remover imagens
- [ ] Reordenar imagens
- [ ] Preservar ordem das imagens
- [ ] Gerar PDF da avaliação
- [ ] Incluir nome do personal
- [ ] Testar diferentes formatos de imagem

### Milestone M4 — Avaliação Física Completa

Resultado esperado:

O usuário consegue preencher uma avaliação física, adicionar imagens e gerar o PDF.

### Sprint 5 — Qualidade e Deploy

- [ ] Testar responsividade
- [ ] Validar formulários
- [ ] Testar geração dos PDFs
- [ ] Testar múltiplas imagens
- [ ] Testar reordenação
- [ ] Corrigir bugs
- [ ] Ajustar interface
- [ ] Testar em celular
- [ ] Testar em desktop
- [ ] Publicar no GitHub Pages

### Milestone M5 — MVP Publicado

Resultado esperado:

PDFit funcionando e disponível publicamente através do GitHub Pages.

## 🗺️ Roadmap

```text
M0 — Planejamento
        ↓
Sprint 1
        ↓
M1 — Fluxo Inicial Funcional
        ↓
Sprint 2
        ↓
M2 — Editor de Treino Completo
        ↓
Sprint 3
        ↓
M3 — Módulo de Treino Concluído
        ↓
Sprint 4
        ↓
M4 — Avaliação Física Completa
        ↓
Sprint 5
        ↓
M5 — MVP Publicado
```

## 🚫 Fora do Escopo

O PDFit não terá, inicialmente:

- Login;
- Cadastro de usuários;
- Backend;
- Banco de dados;
- API;
- Cadastro permanente de alunos;
- Histórico de treinos;
- Histórico de avaliações;
- Armazenamento permanente de imagens;
- Edição de PDF depois da geração;
- Compartilhamento automático dos PDFs;
- Sistema de pagamentos;
- Aplicativo mobile nativo.

## 🔐 Privacidade

O PDFit foi planejado para trabalhar localmente no navegador.

As informações preenchidas e as imagens utilizadas para gerar os documentos não precisam ser enviadas para um servidor.

Ao atualizar ou fechar a página, os dados poderão ser perdidos, pois não existe persistência de dados na versão inicial.

## 🚀 Publicação

O projeto será hospedado no GitHub Pages, permitindo que o PDFit seja acessado diretamente pelo navegador.

Por ser uma aplicação estática, não será necessário configurar servidor ou banco de dados para sua execução.

## 📌 Status do Projeto

Em desenvolvimento 🚧

### Objetivo do MVP

Entregar uma aplicação funcional capaz de:

1. Identificar o personal trainer;
2. Criar fichas de treino;
3. Organizar exercícios;
4. Gerar PDF de treino;
5. Registrar avaliações físicas;
6. Adicionar múltiplas imagens;
7. Organizar as imagens;
8. Gerar PDF da avaliação;
9. Funcionar em dispositivos móveis e computadores;
10. Ser publicada no GitHub Pages.
