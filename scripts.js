
const listarDespesas = async () => {
  let url = 'http://127.0.0.1:5001/listarDespesas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.despesas.forEach(item => insertList(item.tipo_despesa.descricao, item.descricao, item.quantidade, item.valor, item.id_despesa, item.tipo_despesa.id))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

listarDespesas()

function novaDespesa (descricao, quantidade, valor, idTipoDespesa){
  const formData = new FormData();
  formData.append('descricao', descricao);
  formData.append('quantidade', quantidade);
  formData.append('valor', valor);
  formData.append('tipo_despesa_id', idTipoDespesa);

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

const criaBotaoEditar = (parent, id, tipo_despesa_id) => {
  let icone = document.createElement("img");
  icone.setAttribute("width", "30px;");
  icone.setAttribute("height", "35px;");
  icone.setAttribute("onclick","editarDespesa("+id+","+tipo_despesa_id+");");
  icone.setAttribute("id","idEdicao"+id+"");
  icone.src = "img/editar.png";
  parent.appendChild(icone);
}

function editarDespesa(id, tipo_despesa_id){
  btEditar = document.querySelector("#idEdicao"+id+"");
  linha = btEditar.parentElement;
  cols = linha.parentElement.getElementsByTagName("td");

  let options = document.querySelector("#tipoDespesa");
  options[tipo_despesa_id].selected = "selected;"
  document.querySelector("#descricao").value = cols[1].innerHTML;
  document.querySelector("#quantidade").value =cols[2].innerHTML;
  document.querySelector("#valor").value = cols[3].innerHTML;

  abreModal();

  document.querySelector("#botaoSalvar").setAttribute( "onClick", "salvarEditarDespesa("+id+");" );

}

function salvarEditarDespesa(id, tipo_despesa_id){

  let descricao = document.querySelector("#descricao").value;
  let quantidade = document.querySelector("#quantidade").value;
  let valor = document.querySelector("#valor").value;
  let tipoDespesa = document.querySelector('#tipoDespesa option:checked').value

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
      formData.append('tipo_despesa_id', tipoDespesa);

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
    document.querySelector("#descricao").value = "";
    document.querySelector("#quantidade").value = "";
    document.querySelector("#valor").value = "";
    document.querySelector("#botaoSalvar").setAttribute( "onClick", "adicionarDespesa();" );
    reloadTable();
}

const adicionarDespesa = () => {
  let descricao = document.querySelector("#descricao").value;
  let quantidade = document.querySelector("#quantidade").value;
  let valor = document.querySelector("#valor").value;
  let tipoDespesa = document.querySelector('#tipoDespesa option:checked').value

  if (descricao === '') {
    alert("Descrição da despesa obrigatória!");
  } else if (isNaN(quantidade) || isNaN(valor)) {
    alert("Quantidade e valor precisam ser números!");
  } else if (tipoDespesa ==='') {
    alert("O tipo de despesa deve ser informado!");
  } else {
    novaDespesa(descricao, quantidade, valor, tipoDespesa)
    reloadTable();
  }
}

const insertList = (tipo_despesa, descricao_despesa, quantidade, valor, id, tipo_despesa_id) => {
  var item = [tipo_despesa, descricao_despesa, quantidade, valor, id]
  var table = document.querySelector('#myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length-1; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  criaBotaoEditar(row.insertCell(-1), id, tipo_despesa_id)
  criaBotaoExcluir(row.insertCell(-1), id)  
  document.querySelector("#descricao").value = "";
  document.querySelector("#quantidade").value = "";
  document.querySelector("#valor").value = "";
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
  document.querySelector("#descricao").value = "";
  document.querySelector("#quantidade").value = "";
  document.querySelector("#valor").value = "";
  document.querySelector("#botaoSalvar").setAttribute( "onClick", "adicionarDespesa();" );
  modal.close();
}

function reloadTable(){
  var table = document.querySelector('#myTable');
    table.innerHTML = "";
    var cabecalho = '<tr><th>Tipo de Despesa</th><th>Descrição</th><th>Quantidade</th><th>Valor</th><th colspan="2" style="text-align: center;">Ações</th></tr>'
    table.innerHTML += cabecalho;
    listarDespesas();
}

function listarTiposDespesas(){
  let url = 'http://127.0.0.1:5001/listarTipoDespesas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.tipoDespesas.forEach(item => carregaListaTipoDespesa(item.id, item.descricao))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function carregaListaTipoDespesa(id, descricao){
  select = document.querySelector("#tipoDespesa")
  
  const option = document.createElement("option");
  option.value = id;
  option.text = descricao;
  select.add(option, null);
}