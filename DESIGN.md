# Design do PDFit

## Direção visual

O PDFit usa uma interface de ferramenta profissional, simples e orientada a tarefas. A composição prioriza:

- leitura rápida em telas pequenas;
- ações principais visíveis no topo de cada fluxo;
- blocos de conteúdo com superfície elevada;
- feedback nativo do Bootstrap para formulários;
- contraste consistente nos temas claro e escuro.

## Tokens visuais

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| Fundo | `#f5f7fb` | `#0f172a` | Fundo geral e gradiente da aplicação |
| Superfície | `#ffffff` | `#182235` | Cards, formulários e prévias |
| Texto | `#172033` | `#e5e7eb` | Títulos e conteúdo principal |
| Azul de ação | `#2563eb` | `#8ab4ff` | Botões primários, links e foco |
| Fundo suave | `#eef4ff` | `#17243d` | Gradientes e estados de navegação |
| Borda | `#d7deeb` | `#334155` | Campos, cards e divisores |
| Texto secundário | `#64748b` | `#aab7ca` | Placeholders e descrições |

## Tipografia e componentes

- A tipografia usa a pilha nativa do sistema para manter carregamento rápido e renderização consistente.
- Títulos usam peso alto e espaçamento negativo para reforçar hierarquia.
- Cards têm cantos arredondados de `1rem` a `1.25rem` e sombra ampla, sem borda decorativa.
- Ícones são Bootstrap Icons e aparecem como apoio ao texto, nunca como única identificação de uma ação.
- Botões primários usam azul; a avaliação física usa amarelo como ação secundária na tela inicial.
- O modo escuro é o padrão e é persistido em `localStorage`.

## Telas existentes

### T01 — Início

O cabeçalho apresenta a marca e o alternador de tema. O hero comunica o benefício principal (“Treinos e avaliações físicas em PDF”). O card “Começar” concentra o nome do personal trainer e as duas entradas do produto:

- **Criar treino**, ação primária azul;
- **Avaliação física**, ação secundária destacada em amarelo.

O formulário exige um nome com pelo menos dois caracteres e apresenta os estados inválidos pelo Bootstrap antes de navegar.

### T02 — Dados iniciais do treino

O fluxo começa com um link de retorno, seguido de um card com:

1. nome do aluno;
2. divisão do treino (`AB`, `ABC` ou `ABCD`);
3. botão para abrir o editor.

Os campos são obrigatórios. A divisão controla a criação dos dias do treino.

### T03 — Editor de treino

O editor mantém o título do treino e a ação de gerar PDF no topo. Os dias são apresentados como abas/pílulas. Cada dia possui título, comentário e uma lista de cards de exercícios com:

- nome;
- séries;
- repetições;
- comentário opcional;
- ações de reordenação e remoção.

O botão verde de adicionar exercício fica associado ao cabeçalho da lista. Nome, séries e repetições recebem estado inválido visual quando o PDF é solicitado sem preenchimento correto.

### T04 — Avaliação física

O cabeçalho mantém o padrão das outras telas e apresenta a geração do PDF como ação principal. O formulário é dividido em:

- identificação do aluno;
- medidas em centímetros;
- comentário;
- imagens.

As medidas são campos numéricos opcionais, com valores não negativos e passo decimal de `0.1`. Os pares corporais aparecem em ordem anatômica visual esquerda-direita: braço esquerdo ao lado do braço direito, antebraço esquerdo ao lado do antebraço direito, e o mesmo padrão para pernas e panturrilhas.

As imagens são exibidas em cards com prévia, nome, reordenação e remoção. A ordem escolhida é preservada no PDF. Cada imagem ocupa uma página A4 própria, com proporção preservada e limites para evitar distorção ou dimensionamento excessivo.

### T05 — Página 404

A página 404 é independente do bundle principal para funcionar no fallback do GitHub Pages mesmo quando o usuário acessa uma URL profunda. Ela mantém a marca, permite alternar o tema e calcula o caminho base do projeto (`/PDFit/` ou raiz) para retornar ao início.

## Responsividade

- O layout usa containers e grid do Bootstrap.
- Cards e hero reduzem o raio e o espaçamento em telas menores.
- Ações do editor ocupam a largura disponível no celular.
- A grade de medidas usa duas colunas em telas pequenas e quatro em telas médias.
- A prévia do PDF pode rolar horizontalmente quando necessário, sem alterar o documento exportado.
- As páginas de imagem se adaptam à largura da prévia em dispositivos móveis.

## Exportação

Os documentos são renderizados localmente com `html2pdf.js`:

- treino: A4 em paisagem;
- avaliação: A4 em retrato;
- imagens da avaliação: uma página retrato por imagem;
- fundo e conteúdo da exportação permanecem claros, independentemente do tema da interface.

## Navegação e deploy

O projeto é um MPA do Vite com páginas HTML independentes. Os links entre telas usam arquivos relativos, e o build usa base relativa (`./`) para funcionar no subcaminho do GitHub Pages sem depender de domínio ou organização específicos. O build inclui explicitamente `index.html`, `novo-treino.html`, `editor-treino.html`, `avaliacao.html` e `404.html`.
