import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const filtroProduto = document.getElementById("filtroProduto");
const filtroData = document.getElementById("filtroData");
const btnFiltrar = document.getElementById("btnFiltrar");
const tabelaBody = document.querySelector("#tabelaHistorico tbody");

let produtos = [];
let vendas = [];

// Carregar produtos para o filtro
async function carregarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos"));
  produtos = [];
  filtroProduto.innerHTML = '<option value="">Todos</option>';
  snapshot.forEach((docItem) => {
    const data = docItem.data();
    produtos.push({ id: docItem.id, ...data });
    const option = document.createElement("option");
    option.value = docItem.id;
    option.textContent = data.nome;
    filtroProduto.appendChild(option);
  });
}

// Carregar todas as vendas
async function carregarVendas() {
  const snapshot = await getDocs(collection(db, "vendas"));
  vendas = [];
  snapshot.forEach((docItem) => {
    const data = docItem.data();
    vendas.push(data);
  });
}

// Filtrar e exibir vendas
function exibirVendas() {
  tabelaBody.innerHTML = "";
  const produtoId = filtroProduto.value;
  const dataFiltro = filtroData.value;

  vendas.forEach(venda => {
    venda.itens.forEach(item => {
      if ((produtoId === "" || item.produtoId === produtoId) &&
          (dataFiltro === "" || venda.data === dataFiltro)) {

        const produto = produtos.find(p => p.id === item.produtoId);
        let variacao = "";
        if (produto) {
          variacao = (produto.ultimaCompra - produto.penultimaCompra).toFixed(2);
          variacao = variacao > 0 ? `+R$${variacao}` : `R$${variacao}`;
        }

        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${venda.data}</td>
          <td>${produto ? produto.nome : "Produto excluído"}</td>
          <td>${item.quantidade}</td>
          <td>${item.valorUnitario.toFixed(2)}</td>
          <td>${(item.quantidade * item.valorUnitario).toFixed(2)}</td>
          <td>${variacao}</td>
        `;
        tabelaBody.appendChild(linha);
      }
    });
  });
}

// Inicialização
async function init() {
  await carregarProdutos();
  await carregarVendas();
  exibirVendas();
}

// Filtro botão
btnFiltrar.addEventListener("click", exibirVendas);

init();
