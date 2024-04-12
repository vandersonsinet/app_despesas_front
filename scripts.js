
const listarDespesas = async () => {
  let url = 'http://127.0.0.1:5001/listarDespesas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.despesas.forEach(item => insertList(item.descricao, item.quantidade, item.valor, item.id))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

listarDespesas()

function novaDespesa (descricao, quantidade, valor){
  const formData = new FormData();
  formData.append('descricao', descricao);
  formData.append('quantidade', quantidade);
  formData.append('valor', valor);

  let url = 'http://127.0.0.1:5001/adicionaDespesa';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    alert("Despesa incluida com sucesso!")
}


const criaBotaoExcluir = (parent, id) => {
  let icone = document.createElement("img");
  icone.setAttribute("width", "30px;");
  icone.setAttribute("height", "35px;");
  icone.setAttribute("onclick","deletarDespesa("+id+");");
  icone.src = "img/lixeira.png";
  parent.appendChild(icone);
}

const criaBotaoEditar = (parent, id) => {
  let icone = document.createElement("img");
  icone.setAttribute("width", "30px;");
  icone.setAttribute("height", "35px;");
  icone.setAttribute("onclick","editarDespesa("+id+");");
  icone.setAttribute("id","idEdicao"+id+"");
  icone.src = "img/editar.png";
  parent.appendChild(icone);
}

function editarDespesa(id){
  btEditar = document.getElementById("idEdicao"+id+"");
  linha = btEditar.parentElement;
  cols = linha.parentElement.getElementsByTagName("td");

  document.getElementById("descricao").value = cols[0].innerHTML;
  document.getElementById("quantidade").value =cols[1].innerHTML;
  document.getElementById("valor").value = cols[2].innerHTML;

  abreModal();

  document.getElementById("botaoSalvar").setAttribute( "onClick", "salvarEditarDespesa("+id+");" );

}

function salvarEditarDespesa(id){

  let descricao = document.getElementById("descricao").value;
  let quantidade = document.getElementById("quantidade").value;
  let valor = document.getElementById("valor").value;

  if (descricao === '') {
    alert("Descrição da despesa obrigatória!");
  } else if (isNaN(quantidade) || isNaN(valor)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('descricao', descricao);
      formData.append('quantidade', quantidade);
      formData.append('valor', valor);

      let url = 'http://127.0.0.1:5001/editarDespesa';
      fetch(url, {
        method: 'put',
        body: formData
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
      alert("Despesa alterada com sucesso!")
    }
    document.getElementById("descricao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("botaoSalvar").setAttribute( "onClick", "adicionarDespesa();" );
    reloadTable();
}

const adicionarDespesa = () => {
  let descricao = document.getElementById("descricao").value;
  let quantidade = document.getElementById("quantidade").value;
  let valor = document.getElementById("valor").value;

  if (descricao === '') {
    alert("Descrição da despesa obrigatória!");
  } else if (isNaN(quantidade) || isNaN(valor)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    novaDespesa(descricao, quantidade, valor)
    reloadTable();
  }
}

const insertList = (nameProduct, quantity, price, id) => {
  var item = [nameProduct, quantity, price, id]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length-1; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  criaBotaoEditar(row.insertCell(-1), id)
  criaBotaoExcluir(row.insertCell(-1), id)  
  document.getElementById("descricao").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
}

function deletarDespesa(id){
  if (confirm("Confirma a exclusão da despesa?")) {
      removerDespesa(id);
      alert("Despesa removida!");
      reloadTable();
    }
}

function removerDespesa(id){
  let url = 'http://127.0.0.1:5001/removerDespesa?id=' + id;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
}

function abreModal() {
  modal.showModal();
}

function fechaModal() {
  document.getElementById("descricao").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("botaoSalvar").setAttribute( "onClick", "adicionarDespesa();" );
  modal.close();
}

function reloadTable(){
  var table = document.getElementById('myTable');
    table.innerHTML = "";
    var cabecalho = '<tr><th>Descrição</th><th>Quantidade</th><th>Valor</th><th></th><th></th></tr>'
    table.innerHTML += cabecalho;
    listarDespesas();
}