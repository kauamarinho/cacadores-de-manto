# Caçadores de Manto (front-end)

Site que mostra, num globo 3D, as lojas físicas de camisas de futebol vintage pelo mundo.
Você diz em que país e cidade está, o globo gira até lá e mostra onde há lojas.

- **Stack:** React + Vite (JavaScript), globo com [`cobe@0.6.3`](https://github.com/shuding/cobe).
- **Rotas:** `react-router-dom`.
- **Backend:** Spring Boot, na raiz deste repositório (ainda em construção).
  O front tenta buscar os dados na API e, se ela não responder, usa `src/dados/`.

> ⚠️ Não atualize o `cobe` para a 2.x: a API mudou e a projeção dos rótulos (`src/utils/geo.js`)
> foi escrita para a matemática do shader da 0.6.3.

## Pré-requisitos

- [Node.js](https://nodejs.org) LTS (testado com a 24.x), que já traz o `npm`.

Confira no terminal:

```powershell
node -v
npm -v
```

## Instalação

Todos os comandos abaixo são rodados **dentro da pasta `frontend/`**:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

O `.env` guarda o endereço da API (`VITE_API_URL`, padrão `http://localhost:8080`).
Ele não vai para o Git; o modelo versionado é o `.env.example`.
Depois de mudar o `.env`, reinicie o `npm run dev`.

## Como rodar

| Comando           | O que faz                                                     |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento em http://localhost:5173          |
| `npm run build`   | Gera a versão de produção em `dist/`                          |
| `npm run preview` | Serve o conteúdo de `dist/` para conferir o build             |
| `npm run lint`    | Verifica o código com o [oxlint](https://oxc.rs)              |

## Páginas

| Rota             | Página                                                     |
| ---------------- | ---------------------------------------------------------- |
| `/`              | Busca, globo, jogadores, sobre o projeto e polaroids       |
| `/lojas`         | Cards de todas as cidades, com filtro por país (`?pais=`)  |
| `/lojas/:cidade` | Lojas de uma cidade (ex.: `/lojas/sao-paulo`)              |
| `/sugerir`       | Formulário para sugerir uma loja                           |

O menu mostra só **Início** e **Sugerir loja**. A aba "Lojas" saiu do menu por enquanto, mas
as rotas `/lojas` e `/lojas/:cidade` continuam funcionando (o botão "Ver lojas em…" usa a segunda).

## Estrutura

```
frontend/
├── index.html              título, fontes (Google Fonts) e ponto de entrada
├── public/
│   ├── escudos/            escudos dos clubes (<id-do-ponto>.png)
│   ├── jogadores/          PNGs recortados dos jogadores ao lado do globo
│   └── fotos/cidades/      fotos das polaroids
└── src/
    ├── main.jsx            inicia o React
    ├── App.jsx             carrega os pontos e define as rotas
    ├── index.css           todo o visual (variáveis de cor no :root)
    ├── components/
    │   ├── Cabecalho.jsx   logo "Caçadores de Manto" e menu
    │   ├── Busca.jsx       pergunta em duas etapas: país → cidade
    │   ├── CampoBusca.jsx  campo arredondado com sugestões (combobox)
    │   ├── Globo.jsx       globo COBE + rótulos que alternam cidade/escudo
    │   ├── Escudo.jsx      imagem do escudo ou escudo genérico com sigla
    │   ├── Jogador.jsx     recorte de jogador ao lado do globo
    │   ├── Sobre.jsx       texto sobre o objetivo do site
    │   ├── Polaroids.jsx   cidades famosas em formato polaroid
    │   ├── Rodape.jsx      rodapé com os créditos das imagens
    │   ├── CardLoja.jsx    card com cidade, país e clube
    │   └── Pagina.jsx      <main> de cada página (título da aba e foco)
    ├── paginas/
    │   ├── Inicio.jsx      home: busca + globo
    │   ├── Lojas.jsx       /lojas
    │   ├── LojasCidade.jsx /lojas/:cidade
    │   ├── Sugerir.jsx     /sugerir
    │   └── NaoEncontrada.jsx  qualquer outra rota
    ├── servicos/
    │   └── lojas.js        buscarPontos(): API com reserva nos dados locais
    ├── hooks/
    │   ├── useMovimentoReduzido.js  lê prefers-reduced-motion
    │   ├── useRevelar.js   avisa quando um elemento aparece ao rolar
    │   └── useTitulo.js    título da aba
    ├── dados/
    │   ├── pontos.js       cidades, países e clubes
    │   ├── jogadores.js    jogadores dos lados do globo
    │   ├── cidadesFamosas.js  cidades das polaroids
    │   └── creditos.js     autor e licença de cada imagem
    └── utils/
        ├── geo.js          projeção usada pelo shader do COBE
        ├── texto.js        criarSlug() e ordenação em português
        └── validacao.js    regras do formulário "Sugerir loja"
```

## Onde mexer em cada coisa

### Adicionar ou editar uma cidade

Edite `src/dados/pontos.js`. Cada ponto tem este formato:

```js
{
  id: 'lisboa',                 // único, sem acento nem espaço (vai virar URL)
  cidade: 'Lisboa',
  pais: 'Portugal',
  lat: 38.7223,
  lng: -9.1393,
  clube: {
    nome: 'Benfica',
    sigla: 'SLB',               // aparece no escudo genérico (até 3 letras)
    cores: ['#e30613', '#ffffff'], // [fundo do escudo, borda e sigla]
    escudo: '/escudos/lisboa.png', // ou null para o escudo genérico
  },
}
```

O país entra sozinho na lista da busca; não é preciso cadastrá-lo em outro lugar.

### Imagens e créditos

Todas as imagens de terceiros vêm do **Wikimedia Commons**, com licença livre (CC BY, CC BY-SA,
CC0) ou em domínio público. Autor, licença e link de cada uma ficam em `src/dados/creditos.js` e
aparecem no rodapé, em "Créditos das imagens" — as licenças CC BY/BY-SA exigem esse crédito.

- **Escudos** (`public/escudos/`): 14 clubes têm escudo livre no Commons, alguns em versão
  histórica (Arsenal 1952, Benfica 1930, Flamengo 1980–2018, Ajax 1928). Corinthians, América,
  Manchester United e Atlético de Madrid não têm escudo livre e usam o genérico. Escudos são
  marcas dos clubes; aqui servem só para identificar a cidade.
- **Jogadores** (`public/jogadores/`): Zico e Pelé no Flamengo (1979) e Maradona no Boca (1981),
  fotos em domínio público com o fundo removido.
- **Cidades** (`public/fotos/cidades/`): fotos das polaroids.

Para trocar ou incluir uma imagem:

1. Coloque o arquivo na pasta certa (escudo: `public/escudos/<id-do-ponto>.png`, quadrado e com
   fundo transparente; jogador: PNG com fundo transparente).
2. Aponte para ele em `pontos.js`, `jogadores.js` ou `cidadesFamosas.js`.
3. Atualize `creditos.js` com autor, licença e link.

Se um escudo não carregar, o site volta sozinho para o escudo genérico.
Use apenas imagens que você tem direito de usar.

### Cores, fontes e espaçamentos

Tudo está em `src/index.css`. As cores e fontes ficam como variáveis no `:root`
(`--cor-destaque`, `--cor-tinta`, `--fonte-titulo`, etc.); mudando ali, muda no site inteiro.
O tamanho do globo é a variável `--tamanho-globo`.

As fontes são gratuitas e parecidas com a tipografia do Claude (que é licenciada e não pode ser
usada livremente): **Source Serif 4** em peso normal nos títulos e textos longos e **Inter** na
interface (menu, campos e botões).

### Comportamento do globo

Em `src/components/Globo.jsx`:

- `VELOCIDADE_ROTACAO`: velocidade da rotação automática;
- `SUAVIZACAO_FOCO`: rapidez com que o globo gira até a cidade escolhida;
- `TROCA_ROTULO_MS`: intervalo entre mostrar cidade e escudo;
- as opções do `createGlobe` (cores, brilho, tamanho dos marcadores).

### Rótulos sobre o globo

Os rótulos são elementos HTML posicionados a cada quadro pela função `projetar()`
de `src/utils/geo.js`, que repete a matemática do shader do COBE 0.6.3
(conversão lat/lng → 3D, rotação `phi`/`theta` e raio 0.8). Se mudar a versão do
`cobe`, essa função precisa ser revisada.

### Integração com a API

- `src/servicos/lojas.js`: `buscarPontos()` chama `GET {VITE_API_URL}/api/lojas` e espera uma lista
  no mesmo formato de `pontos.js`. Se a API não responder em 3 s, der erro ou devolver outra
  coisa, usa os dados locais (aparece um aviso `console.info`).
- `src/paginas/Sugerir.jsx`: por enquanto só faz `console.log` da sugestão. Procure o
  `// TODO: enviar para POST /api/sugestoes`.
- O backend vai precisar liberar CORS para `http://localhost:5173`.

## Acessibilidade

- Link "Pular para o conteúdo" (aparece ao apertar Tab) e foco levado ao conteúdo ao trocar de página.
- Busca utilizável só com teclado: digite, use ↑/↓ nas sugestões, **Enter** confirma e **Esc** fecha a lista. As sugestões ignoram acentos ("napoles" encontra Nápoles).
- Foco visível em todos os elementos interativos (`:focus-visible` em `index.css`).
- Com `prefers-reduced-motion`, o globo não gira sozinho, as imagens do fundo não alternam e as
  transições são desligadas. Com a aba em segundo plano, o globo para de renderizar.
- Rótulos do globo ficam dentro da área do globo e, quando se sobrepõem, só o mais à frente aparece.
