/* =====================================================
   STUDIO AZIS - JAVASCRIPT
   Quatro blocos, cada um com uma função simples:
   1. Menu no celular
   2. Galeria com foto ampliada
   3. Validação do formulário
   4. Ano automático no rodapé
   ===================================================== */


/* ---------- 1. MENU NO CELULAR ----------
   Ao clicar no botão das três barrinhas, adicionamos ou removemos
   a classe "aberto" no menu. O CSS decide o que essa classe faz. */
const menuBotao = document.getElementById("menuBotao");
const menu = document.getElementById("menu");

menuBotao.addEventListener("click", function () {
  // classList.toggle: se a classe existe, remove; se não existe, adiciona
  const aberto = menu.classList.toggle("aberto");

  // Informa aos leitores de tela se o menu está aberto ou fechado
  menuBotao.setAttribute("aria-expanded", aberto);
});

// Ao clicar em um link do menu, fecha o menu (útil no celular)
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", "false");
  });
});


/* ---------- 2. GALERIA COM FOTO AMPLIADA ----------
   Ao clicar em uma foto, copiamos o endereço da imagem e a legenda
   para a caixa <dialog> e a abrimos. */
const lightbox = document.getElementById("lightbox");
const lightboxImagem = document.getElementById("lightboxImagem");
const lightboxLegenda = document.getElementById("lightboxLegenda");
const lightboxFechar = document.getElementById("lightboxFechar");

// querySelectorAll devolve todos os itens da galeria; forEach repete o código para cada um
document.querySelectorAll(".galeria__item").forEach(function (item) {
  item.addEventListener("click", function () {
    const foto = item.querySelector("img");

    lightboxImagem.src = foto.src;
    lightboxImagem.alt = foto.alt;
    lightboxLegenda.textContent = item.dataset.legenda; // lê o atributo data-legenda do HTML

    lightbox.showModal(); // método nativo do <dialog> que abre a caixa por cima da página
  });
});

lightboxFechar.addEventListener("click", function () {
  lightbox.close();
});

// Clicar fora da foto (no fundo escuro) também fecha
lightbox.addEventListener("click", function (evento) {
  if (evento.target === lightbox) {
    lightbox.close();
  }
});


/* ---------- 3. VALIDAÇÃO DO FORMULÁRIO ----------
   Antes de "enviar", conferimos se os campos foram preenchidos.
   Se estiver tudo certo, montamos a mensagem e abrimos o WhatsApp da empresa
   já com o texto pronto, usando o link oficial wa.me. O cliente só precisa apertar "enviar". */

// Número da empresa: código do país (55) + DDD (61) + número, só dígitos
const NUMERO_WHATSAPP = "5561984015569";
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoContato = document.getElementById("contatoCliente");
const campoMensagem = document.getElementById("mensagem");
const campoTipo = document.getElementById("tipo");
const mensagemSucesso = document.getElementById("sucesso");

// Função auxiliar: mostra (ou limpa) o texto de erro de um campo
function mostrarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  // Marca o campo com a classe que deixa a borda destacada (texto vazio = sem erro)
  campo.parentElement.classList.toggle("campo--invalido", texto !== "");
}

// Função auxiliar: o contato vale se parecer um e-mail OU um telefone (10 a 11 dígitos)
function contatoValido(valor) {
  const pareceEmail = valor.includes("@") && valor.includes(".");
  const somenteNumeros = valor.replace(/\D/g, ""); // remove tudo que não é número
  const pareceTelefone = somenteNumeros.length >= 10 && somenteNumeros.length <= 11;
  return pareceEmail || pareceTelefone;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();          // impede a página de recarregar
  mensagemSucesso.hidden = true;

  let tudoCerto = true;

  if (campoNome.value.trim().length < 2) {
    mostrarErro(campoNome, "erro-nome", "Informe seu nome.");
    tudoCerto = false;
  } else {
    mostrarErro(campoNome, "erro-nome", "");
  }

  if (!contatoValido(campoContato.value.trim())) {
    mostrarErro(campoContato, "erro-contato", "Informe um e-mail válido ou um telefone com DDD.");
    tudoCerto = false;
  } else {
    mostrarErro(campoContato, "erro-contato", "");
  }

  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(campoMensagem, "erro-mensagem", "Escreva pelo menos 10 caracteres sobre o seu projeto.");
    tudoCerto = false;
  } else {
    mostrarErro(campoMensagem, "erro-mensagem", "");
  }

  if (tudoCerto) {
    // 1) Monta o texto da mensagem (\n = quebra de linha)
    const tipoEscolhido = campoTipo.options[campoTipo.selectedIndex].text;
    const texto =
      "Olá, Studio Azis! Meu nome é " + campoNome.value.trim() + ".\n" +
      "Tenho interesse em: " + tipoEscolhido + ".\n" +
      "Meu contato: " + campoContato.value.trim() + "\n\n" +
      campoMensagem.value.trim();

    // 2) Monta o link. encodeURIComponent troca espaços e acentos por códigos aceitos em endereços
    const link = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texto);

    // 3) Abre o WhatsApp em outra aba (no celular abre o aplicativo)
    window.open(link, "_blank", "noopener");

    // 4) Avisa o cliente e deixa um link, caso o navegador tenha bloqueado a nova aba
    const primeiroNome = campoNome.value.trim().split(" ")[0];
    mensagemSucesso.textContent = "Obrigado, " + primeiroNome + "! Abrimos o WhatsApp com a sua mensagem pronta. Se nada abriu, ";
    const linkManual = document.createElement("a");
    linkManual.href = link;
    linkManual.target = "_blank";
    linkManual.rel = "noopener";
    linkManual.textContent = "clique aqui para abrir.";
    mensagemSucesso.appendChild(linkManual);
    mensagemSucesso.hidden = false;
    formulario.reset();
  }
});


/* ---------- 4. ANO AUTOMÁTICO NO RODAPÉ ---------- */
document.getElementById("ano").textContent = new Date().getFullYear();
