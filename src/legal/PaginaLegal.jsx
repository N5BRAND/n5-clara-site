import Simbolo from '../marca/Simbolo.jsx'
import AvisoCookies, { abrirCookies } from './AvisoCookies.jsx'
import LigacoesLegais from './LigacoesLegais.jsx'
import { EMPRESA } from './empresa.js'
import { PRODUTO } from './produto.js'

const Email = () => <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>

function Seccao({ id, n, titulo, children }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}><span>{n}.</span>{titulo}</h2>
      {children}
    </section>
  )
}

function Privacidade() {
  return (
    <>
      <h1>Política de privacidade</h1>
      <p className="legal-data">Atualizada a {EMPRESA.atualizado}</p>
      <p className="legal-intro">Esta política explica que dados trata o site do {PRODUTO.nome} ({PRODUTO.url.replace('https://', '')}), para quê e que direitos tens.</p>

      <Seccao id="responsavel" n="1" titulo="Quem trata os teus dados">
        <p>O responsável pelo tratamento é a empresa <strong>{EMPRESA.nome}</strong>, NIF {EMPRESA.nif}, com sede na {EMPRESA.sede}. É a empresa da marca Nº5.</p>
        <p>Para qualquer pedido sobre os teus dados, escreve para <Email />.</p>
      </Seccao>

      <Seccao id="dados" n="2" titulo="Que dados tratamos">
        <p>Quando te inscreves na {PRODUTO.formulario}, guardamos:</p>
        <ul>
          {PRODUTO.campos.map(c => <li key={c}>{c};</li>)}
          <li>a tua autorização para te contactarmos e a data da inscrição.</li>
        </ul>
        <p>Como em qualquer site, o alojamento regista dados técnicos das visitas, como o endereço IP e o tipo de navegador, para segurança e funcionamento.</p>
      </Seccao>

      <Seccao id="finalidade" n="3" titulo="Para que usamos os dados">
        <ul>{PRODUTO.finalidades.map(f => <li key={f}>{f}</li>)}</ul>
        <p>Não vendemos os teus dados nem os usamos para outros fins.</p>
      </Seccao>

      <Seccao id="fundamento" n="4" titulo="Com que fundamento">
        <p>Tratamos os dados da inscrição com base no teu consentimento, que dás ao marcar a caixa de autorização no formulário (artigo 6.º, n.º 1, alínea a) do Regulamento Geral sobre a Proteção de Dados, RGPD). Podes retirá-lo a qualquer momento, sem afetar o que foi feito antes.</p>
        <p>Os registos técnicos do alojamento assentam no nosso interesse legítimo em manter o site seguro e a funcionar. Os cookies de marketing só são usados com o teu consentimento (ver <a href="#cookies">ponto 8</a>).</p>
      </Seccao>

      <Seccao id="fornecedores" n="5" titulo="Quem mais trata os dados">
        <ul className="forn">
          <li><strong>Netlify</strong>, nos EUA: alojamento do site e receção das inscrições do formulário.</li>
          <li><strong>Stripe Payments Europe</strong>, na Irlanda: pagamento da pré-reserva. Os dados do cartão, do MB WAY ou do Multibanco ficam só na Stripe.</li>
          <li><strong>Google</strong> (Gmail): caixa de correio onde recebemos os teus pedidos e de onde te podemos escrever.</li>
          <li><strong>Meta Platforms Ireland</strong>: só se aceitares os cookies de marketing (ver <a href="#cookies">ponto 8</a>).</li>
        </ul>
        <p>Alguns destes fornecedores estão fora da União Europeia. Nesses casos, a transferência faz-se com as garantias previstas no RGPD, como as cláusulas contratuais-tipo aprovadas pela Comissão Europeia.</p>
      </Seccao>

      <Seccao id="conservacao" n="6" titulo="Durante quanto tempo guardamos os dados">
        <ul>
          <li>Dados da inscrição: até 12 meses depois do lançamento, ou menos se pedires para sair da lista.</li>
          <li>Registos técnicos do alojamento: até 30 dias.</li>
          <li>A tua escolha sobre cookies: fica no teu navegador até a mudares ou apagares.</li>
        </ul>
      </Seccao>

      <Seccao id="direitos" n="7" titulo="Os teus direitos">
        <p>Podes, a qualquer momento:</p>
        <ul>
          <li>pedir acesso aos dados que temos sobre ti;</li>
          <li>pedir a retificação de dados errados ou incompletos;</li>
          <li>pedir o apagamento dos teus dados e sair da lista;</li>
          <li>pedir a limitação do tratamento ou opor-te a ele;</li>
          <li>pedir a portabilidade dos teus dados, num formato de uso corrente;</li>
          <li>retirar o consentimento.</li>
        </ul>
        <p>Para exercer qualquer um destes direitos, escreve para <Email />. Respondemos no prazo de um mês, como prevê o RGPD.</p>
        <p>Se entenderes que os teus dados não estão a ser bem tratados, podes apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), em <a href="https://www.cnpd.pt/">cnpd.pt</a>.</p>
      </Seccao>

      <Seccao id="cookies" n="8" titulo="Cookies">
        <p>O site guarda no teu navegador a tua escolha sobre cookies. É essencial e não precisa de autorização. As letras e as imagens do site são servidas pelo próprio site, sem pedidos a terceiros.</p>
        <p>Com a tua autorização, usamos também cookies de marketing da Meta (Facebook e Instagram): servem para medir os nossos anúncios e para os mostrar a quem já visitou o site. Sem a tua autorização, não são carregados.</p>
        <p>Podes mudar a tua escolha quando quiseres em <a href="#cookies" onClick={abrirCookies}>Definições de cookies</a>, também disponível no rodapé de cada página.</p>
      </Seccao>

      <Seccao id="alteracoes" n="9" titulo="Alterações a esta política">
        <p>Se esta política mudar, publicamos aqui a versão nova, com a data de atualização no topo.</p>
      </Seccao>
    </>
  )
}

function Termos() {
  return (
    <>
      <h1>Termos e condições</h1>
      <p className="legal-data">Atualizados a {EMPRESA.atualizado}</p>
      <p className="legal-intro">Estes termos aplicam-se ao uso do site do {PRODUTO.nome} ({PRODUTO.url.replace('https://', '')}). Ao usar o site, aceitas estes termos.</p>

      <Seccao id="quem" n="1" titulo="Quem somos">
        <p>O site é da <strong>{EMPRESA.nome}</strong>, NIF {EMPRESA.nif}, com sede na {EMPRESA.sede}, empresa da marca Nº5. Contacto: <Email />.</p>
      </Seccao>

      <Seccao id="objeto" n="2" titulo="O que é este site">
        <p>O site apresenta o {PRODUTO.nome}, um produto ainda em pré-lançamento, e permite inscrever-te na {PRODUTO.formulario}. O lançamento está previsto para 1 de dezembro de 2026 e a data pode mudar.</p>
        <p>As funcionalidades descritas e mostradas podem evoluir até ao lançamento. Os nomes de pessoas, os valores e as conversas usados nas demonstrações servem para mostrar como o produto funciona e não correspondem a pessoas nem a negócios reais.</p>
      </Seccao>

      <Seccao id="inscricao" n="3" titulo="A lista de espera e a inscrição">
        <p>Deixar os teus dados na lista de espera é gratuito e não te obriga a comprar nada. Não é uma encomenda nem um contrato de prestação de serviços.</p>
        {PRODUTO.oferta && (
          <p>{PRODUTO.oferta} As condições da pré-reserva estão no <a href="#pre-reserva">ponto 4</a>. As restantes condições do serviço são apresentadas por escrito no lançamento.</p>
        )}
        <p>Os dados que nos dás na inscrição são tratados como descrito na <a href="/privacidade/">política de privacidade</a>. Podes sair da lista a qualquer momento escrevendo para <Email />.</p>
      </Seccao>

      <Seccao id="pre-reserva" n="4" titulo="Pré-reserva e reembolso">
        <p>A pré-reserva é um pagamento antecipado de {PRODUTO.reserva.valor} que te garante {PRODUTO.reserva.garante}. É feita no âmbito da tua atividade profissional, é paga na Stripe e é recebida pela 4IMPROVEMENTS, LDA. O valor é descontado na primeira mensalidade.</p>
        <p>Só há reembolso num destes casos, e o pedido só pode ser feito a partir do dia previsto para o lançamento, 1 de dezembro de 2026:</p>
        <ul>
          <li>o lançamento não acontece ou é adiado mais de 90 dias em relação a essa data;</li>
          <li>por uma impossibilidade técnica da nossa parte, não conseguimos pôr o serviço a funcionar para ti e não resolvemos o problema em 30 dias a contar do teu pedido por escrito;</li>
          <li>deixamos de comercializar o {PRODUTO.nome} antes de começares a usá-lo.</li>
        </ul>
        <p>Fora destes casos, a pré-reserva não é reembolsável, incluindo quando mudas de ideias, não aderes no lançamento ou não usas o serviço.</p>
        <p>O pedido faz-se por escrito para <Email />, até 30 dias depois do facto que o justifica. Devolvemos o valor pago, sem juros, pelo mesmo meio de pagamento ou por transferência bancária, até 30 dias depois de confirmarmos o pedido.</p>
        <p>Ao pagar a pré-reserva, aceitas estas condições. Nada nestes termos afasta direitos que a lei te reconheça e que não possam ser afastados por acordo.</p>
      </Seccao>

      <Seccao id="propriedade" n="5" titulo="Propriedade intelectual">
        <p>Os textos, as ilustrações, o símbolo Nº5 e o resto do conteúdo do site pertencem à {EMPRESA.nome} ou são usados com autorização. Não os podes copiar nem usar para fins comerciais sem autorização escrita.</p>
      </Seccao>

      <Seccao id="responsabilidade" n="6" titulo="Responsabilidade">
        <p>Fazemos o possível para manter o site disponível e correto, mas não garantimos que esteja sempre acessível nem sem erros. O site pode ter ligações para sites de terceiros, pelos quais não somos responsáveis.</p>
      </Seccao>

      <Seccao id="lei" n="7" titulo="Lei aplicável">
        <p>Estes termos regem-se pela lei portuguesa. Qualquer litígio é resolvido pelos tribunais portugueses competentes.</p>
      </Seccao>

      <Seccao id="alteracoes" n="8" titulo="Alterações a estes termos">
        <p>Se estes termos mudarem, publicamos aqui a versão nova, com a data de atualização no topo.</p>
      </Seccao>
    </>
  )
}

export default function PaginaLegal({ pagina }) {
  return (
    <>
      <header className="legal-topo">
        <div className="contentor legal-topo-linha">
          <a href="/" className="topo-marca legal-marca" aria-label={`${PRODUTO.nome}, início`}>
            <Simbolo largura={40} />
            <span>{PRODUTO.nome}</span>
          </a>
          <a href="/" className="legal-voltar">Voltar ao site</a>
        </div>
      </header>
      <main className="contentor legal">
        {pagina === 'termos' ? <Termos /> : <Privacidade />}
      </main>
      <footer className="rodape">
        <div className="contentor rodape-linha">
          <p className="rodape-nota">{EMPRESA.nome} · NIF {EMPRESA.nif} · {EMPRESA.sede}</p>
          <LigacoesLegais />
        </div>
      </footer>
      <AvisoCookies />
    </>
  )
}
