import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const nomeInput = document.getElementById("nomeProduto");
const penultimaInput = document.getElementById("penultimaCompra");
const ultimaInput = document.getElementById("ultimaCompra");
const btnSalvar = document.getElementById("btnSalvar");
const tabelaBody = document.querySelector("#tabelaProdutos tbody");

const colecao = collection(db, "produtos");

// Adicionar produto
btnSalvar.addEventListener("click", async () => {
  const nome = nomeInput.value.trim();
  const penultima = parseFloat(penultimaInput.value) || 0;
  const ultima = parseFloat(ultimaInput.value) || 0;

  if (nome === "") {
    alert("Digite o nome do produto.");
    return;
  }

  try {
    await addDoc(colecao, {
      nome: nome,
      penultimaCompra: penultima,
      ultimaCompra: ultima
    });

    nomeInput.value = "";
    penultimaInput.value = "";
    ultimaInput.value = "";

    listarProdutos();
  } catch (e) {
    console.error("Erro ao adicionar produto:", e);
  }
});

// Listar produtos
async function listarProdutos() {
  tabelaBody.innerHTML = "";
  const snapshot = await getDocs(colecao);

  snapshot.forEach((docItem) => {
    const dados = docItem.data();
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${dados.nome}</td>
      <td>${dados.penultimaCompra.toFixed(2)}</td>
      <td>${dados.ultimaCompra.toFixed(2)}</td>
      <td><button data-id="${docItem.id}" class="excluir">Excluir</button></td>
    `;

    tabelaBody.appendChild(linha);
  });

  document.querySelectorAll(".excluir").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "produtos", id));
      listarProdutos();
    });
  });
}

// Carregar lista ao abrir a página
listarProdutos();
