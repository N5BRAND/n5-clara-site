# Landing page «Tudo num sítio» · N5 Clara

Especificação da página `clara.numerocinco.pt/tudo/`, para onde levam os criativos da leva 3 (TEXTOS.md, nesta pasta).
Escrita a 01/11/2026. É para quem a construir no repositório **N5BRAND/n5-clara-site**.

## 1. O que é

Uma landing page do sistema que já existe (`src/landing/paginas.js`, como `/crm/`, `/dia/` e `/proprietarios/`). Repete a
promessa dos anúncios, mostra a Clara a fazê-la e acaba na reserva. A ideia é uma só: **a Clara junta o CRM, a IA que
qualifica os proprietários e a IA que organiza o dia. Tudo num sítio.**

## 2. O topo muda com `?perfil=`

| `?perfil=` | Para quem | Título | Frase |
|---|---|---|---|
| (nenhum) | todos | Tudo num sítio. | Os teus contactos e imóveis, os teus proprietários e o teu dia, com IA a trabalhar em cada um. |
| `rede` | quem está numa rede (anúncio 08) | Não precisas de trocar de CRM. | O da tua marca continua. A Clara responde às tuas leads, qualifica os proprietários e monta o teu dia. |
| `conta-propria` | independentes (anúncio 07) | A Clara é o teu CRM. Com IA a trabalhar por ti. | Contactos, imóveis e pipeline num sítio. Proprietários que chegam qualificados. O teu dia por ordem de prioridade. |

Um valor desconhecido fica no topo por defeito. O resto da página é igual para todos, para os números serem comparáveis.

## 3. As secções, por esta ordem

1. **A conta é simples:** CRM que se preenche pela conversa + IA que qualifica os teus proprietários + IA que organiza o
   teu dia = Clara, tudo num sítio. Uma frase de cada:
   - **CRM:** fichas de contactos e imóveis, pipeline e histórico, preenchidos pelas conversas da Clara com as tuas leads e
     pelas tuas notas de voz. Sem campos para preencher.
   - **Proprietários:** cada lead de proprietário chega qualificada (motivação, prazo, preço e documentos), com prioridade
     e motivos.
   - **O dia:** por ordem de prioridade, no teu Google Calendar, com o que fazer primeiro.
2. **Do Excel para a Clara:** três linhas «hoje → com a Clara»: contactos num Excel → fichas e pipeline que se preenchem
   pela conversa; proprietários perdidos no WhatsApp → leads de proprietários qualificadas; o dia na cabeça → o dia por
   ordem de prioridade.
3. **Uma ficha onde tudo se junta:** a cena da ficha do anúncio 06 (Carlos Mendes, T3 em Benfica, pontuação 78, lead
   qualificada, nota de voz de terça, pipeline «Avaliação a marcar», «10:00 · Ligar ao Carlos»), no formato das cenas das
   outras páginas e marcada como exemplo com dados fictícios.
4. **Já tens o CRM da tua marca?** O CRM da marca continua e a Clara trata do resto. O copiloto que preenche o CRM da marca
   é da Clara Elite. Com a pré-reserva, tens o copiloto durante 3 meses desde a ativação, em qualquer plano. Usar o mesmo
   texto da nota da página `/crm/` (que já vem da OFERTA), sem prometer nada para o dia 1 além do que ela diz.
5. **Reserva:** o bloco de reserva e o formulário das outras landing pages (nome, email e telefone, uma pergunta de cada
   vez), com o assistente.

## 4. Regras

- **Só factos que o site já diz.** Usar os mesmos factos de `netlify/assistente/conhecimento.js`, `src/legal/produto.js` e
  das páginas `/crm/`, `/dia/` e `/proprietarios/`. Se uma frase dos anúncios não tiver apoio no site (por exemplo, as
  fichas de imóveis ou o histórico no dia 1), não a usar: dizer ao Pedro no PR, e ele decide.
- **Escrita:** português de Portugal; sem IVA; nunca dizer que as mensagens precisam de aprovação; sem travessões; tom das
  outras landing pages.
- **Medição:** o modo de teste (`?teste=1` e o browser do Claude) nunca chega à Meta nem aos números. Os eventos do Pixel,
  do PostHog e o `utm_content` funcionam como nas outras landing pages.
- **Entrega:** testes verdes e o guia do site atualizado. Abrir o PR e fazer o merge **só com o OK explícito do Pedro**.
  Tem de estar no ar até quarta, 04/11, às 08:00. O lançamento da leva 3 está marcado para essa manhã e só avança com
  `https://clara.numerocinco.pt/tudo/` a responder.

## 5. Como ficou construída (01/11/2026)

- Página própria, como o diagnóstico e o arquétipo: dados em `TUDO` (`src/landing/paginas.js`), componente
  `src/landing/Tudo.jsx`, pasta `tudo/` e entrada no `vite.config.js`. Também entra no painel «Por onde começar»
  (`src/logica/mapa.js`), como a dor «Tenho tudo espalhado entre o Excel, o WhatsApp e a cabeça».
- O topo usa a conversa da Clara de quinta às 08:00 (a ligação ao Carlos às 10:00 e 2 proprietários qualificados durante
  a noite), marcada como exemplo.
- Plano escolhido no formulário: Clara (a ficha, a qualificação dos proprietários e o plano do dia estão no plano Clara).
- Ficaram de fora, por não terem apoio no site: as fichas de imóveis e o histórico (anúncios 03 e 07). A página fala da
  ficha de cada cliente, da etapa de cada negócio e dos imóveis em geral.
- O site nunca se tinha chamado CRM. A página passa a dizê-lo («CRM que se preenche pela conversa»; no topo da conta
  própria, «A Clara é o teu CRM»), apoiada no que o site já diz: a ficha de cada cliente, as notas de voz registadas, a
  etapa de cada negócio e o pipeline de proprietários.
