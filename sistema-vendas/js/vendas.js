import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const produtoSelect = document.getElementById("produtoSelect");
const quantidadeInput = document.getElementById("quantidade");
const valorUnitarioInput = document.getElementById("valorUnitario");
const btnRegistrar = document.getElementById("btnRegistrarVenda");
const tabelaBody = document.querySelector("#tabelaResumo tbody");
const totalVendaSpan = document.getElementById("totalVenda");

let produtos = [];
let totalVenda = 0;

// Função para carregar produtos do Firestore
async function carregarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos"));
  produtos = [];
  produtoSelect.innerHTML = "";
  snapshot.forEach((docItem) => {
    const data = docItem.data();
    produtos.push({ id: docItem.id, ...data });
    const option = document.createElement("option");
    option.value = docItem.id;
    option.textContent = data.nome;
    produtoSelect.appendChild(option);
  });
}

carregarProdutos();

// Atualiza valor unitário ao mudar o produto
produtoSelect.addEventListener("change", () => {
  const selecionado = produtos.find(p => p.id === produtoSelect.value);
  if (selecionado) valorUnitarioInput.value = selecionado.ultimaCompra.toFixed(2);
});

// Registrar venda
btnRegistrar.addEventListener("click", async () => {
  const produtoId = produtoSelect.value;
  const quantidade = parseInt(quantidadeInput.value);
  const valorUnitario = parseFloat(valorUnitarioInput.value);

  if (!produtoId || quantidade <= 0 || valorUnitario <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const produto = produtos.find(p => p.id === produtoId);
  const totalItem = quantidade * valorUnitario;

  // Adicionar linha na tabela resumo
  const linha = document.createElement("tr");
  linha.innerHTML = `
    <td>${produto.nome}</td>
    <td>${quantidade}</td>
    <td>${valorUnitario.toFixed(2)}</td>
    <td>${totalItem.toFixed(2)}</td>
  `;
  tabelaBody.appendChild(linha);

  totalVenda += totalItem;
  totalVendaSpan.textContent = totalVenda.toFixed(2);

  // Salvar venda no Firestore
  try {
    await addDoc(collection(db, "vendas"), {
      data: new Date().toISOString().split("T")[0],
      itens: [{ produtoId, quantidade, valorUnitario }],
      valorTotal: totalItem
    });

    // Atualizar penultima e ultima compra no produto
    const produtoRef = doc(db, "produtos", produtoId);
    await updateDoc(produtoRef, {
      penultimaCompra: produto.ultimaCompra,
      ultimaCompra: valorUnitario
    });

    alert("Venda registrada com sucesso!");
    carregarProdutos(); // Atualiza select
    tabelaBody.innerHTML = "";
    totalVenda = 0;
    totalVendaSpan.textContent = totalVenda.toFixed(2);
  } catch (e) {
    console.error("Erro ao registrar venda:", e);
    alert("Erro ao registrar venda!");
  }
});