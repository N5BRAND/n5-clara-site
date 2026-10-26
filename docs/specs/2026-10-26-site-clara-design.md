# Site da N5 Clara: desenho

26/10/2026 · Pedro Ferreira

## Objetivo

Página única que mostra a N5 Clara a trabalhar ao longo de um dia e leva consultores imobiliários em Portugal a entrarem na lista de espera do lançamento de 1 de dezembro.

Fonte do produto: `Arquitetura/N5-Clara-esboco-do-sistema.pdf`. O «N5 OS» do esboço chama-se, no site, «N5 Imobiliário».

Fora de âmbito: preços, descontos, Terrae, versão em inglês.

## Mensagem

- Promessa: a tua assistente comercial. Responde às tuas leads, organiza o teu dia e mostra onde perdes tempo e negócios. Vender mais sem trabalhar mais horas.
- Quatro promessas do esboço: nenhuma lead sem resposta; sabes o que fazer hoje; sabes quanto vais vender; sabes onde perdes tempo.
- Chat primeiro: o consultor fala ou escreve à Clara, no escritório ou na rua, e não regista nada à mão.

## Estrutura da página

1. **Hero.** Título, subtítulo, botão para a lista de espera e uma conversa com a Clara a escrever-se sozinha (incluindo uma nota de voz).
2. **Quatro promessas.** Secção com scroll próprio: cada promessa fica envolvida em dourado, uma de cada vez.
3. **Um dia com a Clara** (a demo, ver abaixo).
4. **Uma assistente, nove agentes.** A Clara ao centro e os nove agentes à volta, em linguagem simples, mais as ligações: WhatsApp e Meta, Google Calendar, telefone, CRM da marca (copiloto), ChatGPT e Claude.
5. **Ao lado do CRM da tua marca.** O copiloto a preencher sozinho um formulário de CRM com o que a Clara captou.
6. **O que passas a saber.** As perguntas que a Clara responde em segundos (de onde vem o negócio, se respondo depressa, onde caem os negócios, quanto vou faturar, se estou a melhorar ao telefone), mais o diagnóstico inicial e o relatório Antes e Depois aos 30 e 90 dias. Sem números.
7. **Planos.** Clara, Clara Pro e Clara Elite com o que cada um inclui. Sem preços.
8. **Cresce contigo.** Equipa até 5 consultores na Clara; quando a agência cresce, a carteira passa para o N5 Imobiliário sem recomeçar.
9. **Lista de espera.** Lançamento a 1 de dezembro, contagem decrescente e formulário. Sem oferta de desconto.
10. **Rodapé.** Símbolo e «N5 Clara».

## Um dia com a Clara

Palco fixo durante o scroll, como no site do N5 Imobiliário. Em vez da rua, uma faixa com o dia: o céu muda de manhã para noite, o sol percorre um arco e as horas vão passando. A Clara e o consultor (Rui) conversam num telemóvel; ao lado aparece o que a Clara fez.

1. **08:00 · Plano do dia.** A Clara diz bom dia e entrega o plano por prioridade: visitas, leads a seguir, documento em falta, comprador novo que encaixa.
2. **09:12 · Lead nova.** Uma lead da campanha na Meta chega; a Clara responde e qualifica sozinha em minutos e resume: tipo, procura, orçamento, crédito.
3. **11:30 · Chamada com coaching.** O Rui liga a partir da ficha; no fim, o que correu bem, o que melhorar e o próximo passo.
4. **14:45 · Na rua, nota de voz.** O Rui sai de uma visita e grava uma nota; a Clara transcreve, regista o feedback, marca a segunda visita e deteta o marco.
5. **16:20 · Angariação.** Imóvel angariado: checklist de documentos, pedido ao proprietário por WhatsApp e três compradores da carteira que encaixam.
6. **19:00 · Fim do dia.** Relatório: previsão de vendas do mês, onde perde tempo (com sugestão) e coaching do dia.

## Lista de espera

- Lançamento a 1 de dezembro de 2026; contagem decrescente.
- Campos: nome, email, telefone (opcional), agência ou rede, plano que interessa (Clara, Pro, Elite, ainda não sei), consentimento obrigatório.
- Netlify Forms, formulário «lista-clara», com honeypot.

## Regras herdadas do site N5 Imobiliário

- Nada diz «ilustrativo»; rótulos em Arial; rodapé sem Instagram nem site.
- Não se fala em aprovação de mensagens nem em aviso de gravação nas chamadas.
- PT-PT, tratamento por tu, sem travessões, marca Nº 5 (símbolo oficial, cores, letra).
- Responsivo de 320 px ao computador desde o início, com o mesmo ajuste de altura nas secções com scroll.

## Técnica e entrega

- Projeto `Website-Clara/`, Vite + React + `motion` 14.6.0, reaproveitando do site N5 Imobiliário o símbolo, o ajuste de altura, a revelação por passos, as personagens e a lógica (linha do tempo, validação, contagem, envio).
- Testes `vitest` para a lógica e os dados da demo; verificação com capturas em 360, 768 e 1440 px.
- Repositório privado `4ImprovementsPortugal/n5-clara-site`; site novo no Netlify `n5-clara` com Netlify Forms ligado. Publicar só com o OK do Pedro.
