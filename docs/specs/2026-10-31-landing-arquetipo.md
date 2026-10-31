# Landing page do teste de arquétipos · N5 Clara

Especificação para construir a página `clara.numerocinco.pt/arquetipo/`, para onde levam os criativos da leva 2 («Criativos Nº5 Clara · arquétipos»). Escrita a 31/10/2026 a partir do código atual do site (repositório **n5-brand/n5-clara-site**). Serve para quem a construir: uma pessoa ou um agente de código.

## 1. O que é
Uma página só, com um teste de 8 perguntas. A pessoa responde, descobre que tipo de consultor é e, logo a seguir, vê a oferta certa para ela: a pré-reserva de 27 € com o plano já escolhido.
- **Uma página, não quatro.** Todos os anúncios levam a `/arquetipo/`. Só o título do topo muda conforme o anúncio (`?dor=`). O teste é igual para todos, para os resultados serem comparáveis.
- **Os 4 resultados saem do mesmo modelo**, com o texto de cada arquétipo.
- **As páginas que já estão no ar** (`/angariacao/`, `/dia/`, `/leads/`…) ficam como estão. O resultado liga para elas como «Ver como a Clara faz isto».

## 2. O caminho de quem chega
1. Clica num anúncio, por exemplo o do Bombeiro: `…/arquetipo/?dor=organizacao&utm_content=cla_arq_bombeiro_espelho`.
2. O topo repete a pergunta do anúncio («São 19h e ainda estás a pedir documentos por WhatsApp?») e tem um botão «Fazer o teste».
3. Responde a 8 perguntas, uma por ecrã, com barra de progresso e «Voltar». Todas aceitam «Não sei».
4. Vê o resultado no lugar do teste: o arquétipo; o segundo arquétipo, se pesar; onde perde negócios; o que a Clara faz por ele; o plano recomendado.
5. Opcional: «As tuas contas», com 3 números (faturação, negócios fechados e objetivo, todos a 12 meses). Mostra quantos negócios lhe faltam e quantos por mês.
6. Logo abaixo: a inscrição e a pré-reserva de 27 €, com o plano já escolhido e um aviso próprio do arquétipo. É o formulário que já existe no site.

## 3. O topo conforme o anúncio (`?dor=`)
| `?dor=` | Arquétipo | Título (h1) |
|---|---|---|
| (nenhum) | n/a | Que tipo de consultor és? |
| `angariacao` | Caçador | Tens mais compradores do que casas para lhes mostrar? |
| `organizacao` | Bombeiro | São 19h e ainda estás a pedir documentos por WhatsApp? |
| `prioridades` | Malabarista | 47 contactos por responder. Por qual começas? |
| `performance` | Maratonista | Sabes hoje quanto vais faturar este mês? |

O topo é igual para todas as dores:
- **Eyebrow:** «N5 Clara · Teste para consultores»
- **Texto:** «8 perguntas sobre o que fizeste ontem, não sobre o que achas. No fim, sabes que tipo de consultor és, onde estás a perder negócios e o plano da Clara que te serve.»
- **Botões:** «Fazer o teste» (vai para `#teste`) e «Ver a oferta» (vai para `#lista`).

Um valor de `dor` desconhecido conta como se não houvesse nenhum.

## 4. As 8 perguntas e os pontos
As perguntas 1 a 6 dão pontos aos arquétipos. As perguntas 7 e 8 só servem para escolher o plano. «Não sei» não dá pontos.

**P1 · `ontem` · Ontem, o que te ocupou mais tempo?**
- Papéis, mensagens e registos: Bombeiro +3
- Procurar imóveis e proprietários: Caçador +3
- Responder a contactos novos: Malabarista +3
- Chamadas e visitas que tinha planeado: Maratonista +3

**P2 · `angariacoes` · Quantas angariações novas fizeste no último mês?**
- Nenhuma: Caçador +3
- 1 ou 2: Caçador +1
- 3 a 5: nenhum
- Mais de 5: Maratonista +1

**P3 · `ligar` · Esta manhã, como decidiste a quem ligar primeiro?**
- Pelo que apareceu no WhatsApp: Malabarista +3
- Tinha uma lista feita na véspera: Maratonista +2
- Não liguei, fui tratar de papéis: Bombeiro +3
- Liguei primeiro a proprietários: Caçador +2

**P4 · `registo` · Onde ficou registada a tua última visita?**
- No CRM, no próprio dia: Maratonista +1
- No telemóvel ou num caderno: Bombeiro +2
- Ainda não a registei: Bombeiro +2, Malabarista +1
- Não fiz visitas esta semana: Caçador +2

**P5 · `resposta` · Na última semana, quanto tempo demoraste a responder a um contacto novo?**
- Menos de 15 minutos: nenhum
- Até 1 hora: nenhum
- Algumas horas: Malabarista +2
- No dia seguinte ou mais: Malabarista +3, Bombeiro +1

**P6 · `mes` · Sabes hoje quanto vais faturar este mês?**
- Sim, sei ao certo: nenhum
- Tenho um objetivo, mas não sei se lá chego: Maratonista +3
- Não tenho um objetivo definido: Bombeiro +1

**P7 · `telefone` · Quantas horas por dia passas ao telefone?** (só para o plano) Respostas: «Menos de 1», «1 a 3», «3 ou mais».
**P8 · `anuncios` · Pagas anúncios ou portais para ter contactos?** (só para o plano) Respostas: «Sim, todos os meses», «Às vezes», «Não».

O máximo é 10 pontos para cada arquétipo, por isso nenhum parte em vantagem.

## 5. Como se escolhe o resultado
1. **Arquétipo:** o que tiver mais pontos.
2. **Empate:** ganha o arquétipo da resposta à P1. Se a P1 foi «Não sei», a ordem é Caçador, Bombeiro, Malabarista, Maratonista.
3. **Tudo «Não sei»** (zero pontos em todos): usa o arquétipo do `?dor=`. Sem `dor`, mostra «Com tantos "não sei" ainda não conseguimos dizer» e um botão para refazer o teste.
4. **Segundo arquétipo:** o segundo com mais pontos, se tiver pelo menos 3. Aparece como «com um pé de Malabarista».
5. **Plano:** **Clara Elite** se a P7 for «3 ou mais»; senão, **Clara Pro** se a P8 for «Sim, todos os meses» ou «Às vezes», ou se o arquétipo for o Maratonista (o calendário de performance só existe na Pro e na Elite); senão, **Clara**.

## 6. Os 4 resultados
Os textos são os mesmos dos cartões dos criativos. No resultado, o nome aparece no masculino com o feminino por baixo, em pequeno: «O Caçador» e, por baixo, «ou a Caçadora».

### Caçador · Angariação
- **Frase:** Vive à procura do próximo imóvel.
- **Reconheces-te se:** Tens compradores à espera e poucas casas para lhes mostrar.
- **Ponto forte:** Não tens medo de pegar no telefone.
- **Onde perdes negócios:** Na angariação: o próximo imóvel demora a aparecer.
- **O que a Clara faz:** Qualifica as tuas leads de proprietários (motivação, prazo, preço e documentos).
- **Ver como:** `/angariacao/`
- **Aviso junto à oferta:** «Angariação. No primeiro dia, a Clara qualifica as tuas leads de proprietários. A lista semanal de proprietários a vender sozinhos na tua zona chega depois do lançamento, primeiro para quem entra a 1 de dezembro.»

### Bombeiro · Organização do dia
- **Frase:** Passa o dia a apagar fogos.
- **Reconheces-te se:** São 19h e ainda estás a responder a mensagens e a pedir papéis.
- **Ponto forte:** Ninguém fica sem resposta tua.
- **Onde perdes negócios:** No tempo: as chamadas que dão negócio ficam para amanhã.
- **O que a Clara faz:** Regista as tuas notas de voz, pede os documentos ao proprietário e monta o teu plano do dia.
- **Ver como:** `/dia/` (e `/proprietarios/` para os documentos)
- **Aviso junto à oferta:** nenhum. Tudo isto está no plano Clara.

### Malabarista · Prioridades
- **Frase:** Tem sempre dez bolas no ar.
- **Reconheces-te se:** Ligas primeiro a quem escreveu por último.
- **Ponto forte:** Chegas a toda a gente.
- **Onde perdes negócios:** Nas prioridades: o comprador que estava pronto fica para depois.
- **O que a Clara faz:** Dá a cada lead uma pontuação de 0 a 100 e põe o teu dia por ordem de prioridade.
- **Ver como:** `/leads/`
- **Aviso junto à oferta:** nenhum.

### Maratonista · Performance e ritmo
- **Frase:** Tem um objetivo e quer lá chegar.
- **Reconheces-te se:** Sabes o que queres faturar no ano, mas não quanto vais faturar este mês.
- **Ponto forte:** Sabes o que queres faturar.
- **Onde perdes negócios:** No ritmo: só dás por isso no fim do mês.
- **O que a Clara faz:** Monta a tua semana em blocos de prospeção, posicionamento e reuniões, e ajusta-a todas as semanas com coaching.
- **Ver como:** `/chamadas/` (coaching das chamadas, na Elite)
- **Aviso junto à oferta:** «Clara Pro e Elite. O calendário de performance nasce na sessão de configuração: a Clara divide a tua semana em blocos de prospeção, posicionamento e reuniões, conforme a faturação e os objetivos que definires, e ajusta-o todas as semanas com coaching e dicas de prospeção e de chamadas. Faz parte da Clara Pro e da Clara Elite, com o preço anunciado no lançamento. A pré-reserva garante-te já a entrada no primeiro dia.»

**O plano no resultado:** um cartão «O plano que te serve melhor» com o nome do plano, uma frase a explicar porquê e dois botões: «Quero a Clara» (vai para `#lista`) e «Refazer o teste». As frases:
- Elite: «Passas mais de 3 horas por dia ao telefone.»
- Pro: «Pagas para ter contactos.» No Maratonista: «O calendário de performance faz parte da Pro.»
- Clara: «Tudo o que precisas está no plano base.»

## 7. «As tuas contas» (opcional, logo depois do resultado)
São três campos numéricos com «Não sei»: faturação nos últimos 12 meses, negócios fechados nos últimos 12 meses e objetivo para os próximos 12 meses.
- **Reaproveitar** `calcularDiagnostico({ faturacao, negocios, objetivo })` de `src/logica/diagnostico.js` e mostrar só o bloco `objetivo` (por exemplo «+4 negócios por ano… cerca de 1,1 por mês»). Usar o `lerNumero` do mesmo ficheiro para ler os números.
- **Sem os três números**, não aparece nada.
- **No Maratonista**, por cima do bloco: «É com estes números que a Clara monta o teu calendário de performance.»

## 8. A oferta
Usar o componente `Lista` que já existe (`src/secoes/Lista.jsx`):
- `aviso` = o aviso do arquétipo (secção 6), quando há;
- `extra` = `{ diagnostico: resumo }`, que segue para o GHL e fica na nota do contacto;
- **o plano já escolhido:** depois do resultado, `window.dispatchEvent(new CustomEvent('escolher-plano', { detail: plano }))`, como faz o diagnóstico.

**O resumo** é uma linha de texto que segue com a inscrição. Formato:
`Arquétipo: Bombeiro (com um pé de Malabarista) | Plano: Clara | Ontem, o que te ocupou mais tempo? Papéis, mensagens e registos | … | Faturação 12 meses: 43.200 € | Negócios 12 meses: 9 | Objetivo 12 meses: 60.000 €`

### Portão: decisão a tomar
Na conversa propus que o relatório completo só aparecesse depois do nome, do email e do telemóvel. Ao ver o código, recomendo começar **sem portão**: o formulário de inscrição do site tem 7 passos e acaba na pré-reserva, por isso pô-lo antes do resultado afasta quem só quer saber o arquétipo; o Lead continua a contar na inscrição, como em todas as outras páginas.
Se mais tarde quiseres testar o portão, a mudança é pequena: as «contas» só aparecem depois de `inscricao_enviada`. Para isso, o `FormularioPassos.jsx` tem de lançar um evento `inscricao-enviada` no `window` quando a inscrição é enviada.

## 9. Dados e medição
**Respostas anónimas (todas, mesmo de quem não se inscreve):** no fim do teste, enviar ao formulário Netlify `diagnostico` (já existe): `respostas = resumo`, `origem = origemDe(location.pathname, location.search)`. Assim fica a distribuição real dos arquétipos e dá para ver qual anúncio trouxe cada um.

**Inscrição:** é o formulário `lista-clara` de sempre. A página e o anúncio seguem no campo `origem`; o GHL já põe a etiqueta `pagina-arquetipo`. Com o novo site da Clara (ramo `compras-por-anuncio`), a inscrição também segue para o N5 Controlo, que liga as compras da Stripe a cada anúncio.

**PostHog** (função `marcar` de `src/legal/analitica.js`):
| Evento | Quando | Propriedades |
|---|---|---|
| `arquetipo_iniciado` | primeira resposta | `dor` |
| `arquetipo_pergunta` | cada resposta | `n`, `id`, `nao_sei` |
| `arquetipo_resultado` | resultado mostrado | `arquetipo`, `segundo`, `plano`, `dor` |
| `arquetipo_contas` | contas preenchidas | nenhuma |
Os eventos da inscrição (`inscricao_iniciada`, `passo_visto`, `inscricao_enviada`) continuam a ser os do formulário.

**Meta** (função `evento` de `src/legal/pixel.js`; só sai com os cookies de marketing aceites): no resultado, `evento('ViewContent', { content_name: 'arquetipo-bombeiro', content_category: 'arquetipo' })`, para públicos de remarketing por arquétipo. Sai uma vez por resultado, sem `eventID`. O Lead continua na inscrição, sem mudanças.

**N5 Controlo:** a página aparece em «Campanhas e funil › Por landing page» como `/arquetipo/`, pelo endereço no fim do nome dos anúncios.

## 10. Onde mexer no código
| Ficheiro | O que fazer |
|---|---|
| `arquetipo/index.html` | Novo. Cópia de `leads/index.html` com `data-landing="arquetipo"`. Título «Que tipo de consultor és? · N5 Clara». Descrição: «8 perguntas sobre o que fizeste ontem. Descobre que tipo de consultor és e onde estás a perder negócios.» |
| `vite.config.js` | Juntar `'arquetipo'` à lista das landing pages. |
| `src/logica/arquetipo.js` | Novo, só funções puras: `ARQUETIPOS`, `PERGUNTAS`, `DOR_PARA_ARQUETIPO`, `TITULOS`, `pontuar(respostas)`, `escolher(respostas, dor)` (devolve `{ arquetipo, segundo, pontos }`), `planoDe(respostas, arquetipo)`, `resumo(respostas, resultado, contas)`. |
| `src/landing/Arquetipo.jsx` | Novo. Seguir a estrutura de `src/landing/Diagnostico.jsx`: `TopoLanding` (com `como={{ href: '#teste', texto: 'Teste' }}`), `HeroLanding`, a secção `#teste` com o questionário ou o resultado, e `Lista` com `aviso` e `extra`. Reaproveitar as classes `diag-*` e `prioridade` para as perguntas. |
| `src/landing/Landing.jsx` | `HeroLanding` ganha a prop opcional `primeiro = { href: '#lista', texto: CTA }`. Hoje o primeiro botão vai sempre para a inscrição. |
| `src/landing/montar.jsx` | `id === 'arquetipo'` monta `ArquetipoPagina`. |
| `src/landing/paginas.js` | Novo `export const ARQUETIPO` com os textos da página. **Não o pôr dentro de `PAGINAS`:** o teste `landing.test.js` exige as 7 chaves que lá estão. |
| `src/estilos/landing.css` | Classes `arq-*` para o cartão do resultado (nome grande, frase, as três linhas «ponto forte / onde perdes / o que a Clara faz»), e `#teste { scroll-margin-top: 68px }`. Usar as variáveis que já existem (`--dourado`, `--suave`, `--titulo`, `--mono`). |
| `testes/arquetipo.test.js` | Novo (ver secção 12). |
| `netlify/ghl.js` (opcional) | Etiqueta `arquetipo-<id>`, lida da linha «Arquétipo:» do campo `diagnostico`, para workflows no GHL por arquétipo. Com teste em `ghl.test.js`. |
**Não é preciso:** formulários Netlify novos (reaproveitam-se `diagnostico` e `lista-clara`), mexer na função `submission-created`, nem variáveis novas na Netlify.

## 11. Regras do texto
- Português de Portugal, por «tu», frases curtas.
- **Sem travessões** (— e –) e sem as palavras «aprovação», «aprovar», «ilustrativo» e «consentimento». Os testes do site falham com elas.
- Nunca prometer faturação («vais faturar X»). Fala-se de ritmo e de contas com os números da pessoa.
- Do Caçador, não prometer a lista de proprietários a vender sozinhos para o primeiro dia (ver o aviso da secção 6).
- Nada de dados inventados no resultado. As contas usam só os números que a pessoa escreveu.

## 12. Testes e verificação antes de publicar
**Testes automáticos** (`npm test`, ficheiro `testes/arquetipo.test.js`):
- Respostas que levam a cada um dos 4 arquétipos (por exemplo, P1 papéis + P3 papéis + P4 telemóvel dá Bombeiro).
- O empate decide-se pela P1. Tudo «Não sei» com `dor` dá o arquétipo da dor; sem `dor`, dá `null`.
- O segundo arquétipo só aparece com 3 pontos ou mais.
- O plano: 3+ horas ao telefone dá Elite; anúncios dá Pro; Maratonista sem anúncios dá Pro; os outros dão Clara.
- O resumo tem o arquétipo, o plano e as respostas, e diz «não sei» onde a resposta foi «Não sei».
- Os textos (`ARQUETIPOS`, `PERGUNTAS`, `TITULOS`, `ARQUETIPO`) passam a mesma regra do texto de `landing.test.js`.
- O máximo de pontos de cada arquétipo é 10.
**À mão:**
1. `npm test` e `npm run build` a passar.
2. Ver a página no telemóvel (390 px de largura) e no computador, com e sem `?dor=` para cada uma das 4 dores.
3. Fazer o teste 4 vezes, uma por arquétipo, e confirmar o plano escolhido no formulário.
4. Fazer uma inscrição de teste e confirmar: no Netlify, a submissão `lista-clara` com o `diagnostico` preenchido; no GHL, a etiqueta `pagina-arquetipo` e a linha «Diagnóstico: Arquétipo: …» na nota; no PostHog, os eventos `arquetipo_*`.
5. Com os cookies de marketing aceites, ver o ViewContent em Gestor de Eventos › Testar eventos.
6. Apagar o contacto de teste do GHL.

## 13. Publicar e ligar os anúncios
- **Ramo:** trabalhar num ramo a partir do `main` (por exemplo `arquetipo`). Há outro ramo à espera, `compras-por-anuncio` (inscrições para o N5 Controlo). Os dois juntam-se no `main` antes de publicar.
- **Netlify:** o site `n5-clara` vai passar para a conta do Pedro. Publicar a partir do `main` atual, para não apagar nada do que está no ar. (DESATUALIZADO: desde a tarde de 31/10/2026, o site live https://clara.numerocinco.pt é o projeto Netlify `n5-clara-site`, ligado a este repositório no ramo `main`. Cada merge no `main` publica logo; cada PR tem pré-visualização privada. O projeto antigo `n5-clara` ficou sem domínio e sem Git.)
- **Destino de cada anúncio:** `https://clara.numerocinco.pt/arquetipo/?dor=<dor>&utm_source=meta&utm_medium=paid&utm_campaign=lancamento&utm_content=<utm_content>`. O `utm_content` de cada criativo está no `TEXTOS.md` da leva (por exemplo `cla_arq_bombeiro_espelho`).
- **Nome de cada anúncio:** `CLA · ARQ · <ARQUÉTIPO> · <FORMATO> · /arquetipo/`. O endereço no fim do nome é o que o Controlo usa para a página.
- **Campanha (proposta, decisão do Pedro):** uma campanha nova, separada dos 6 conjuntos ABO atuais. Um conjunto por dor, com o mesmo orçamento, para as dores competirem em pé de igualdade, e objetivo Leads.
- **Compras da Stripe por anúncio:** precisam do `N5_CONTROLO_CHAVE` nas variáveis do site da Clara.

## 14. Em aberto
- O portão antes das contas (secção 8): começar sem portão e testar depois.
- A etiqueta `arquetipo-<id>` no GHL (secção 10): só faz falta se quiseres workflows diferentes por arquétipo.
- As versões 9:16 dos criativos que forem escolhidos.
