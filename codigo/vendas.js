//
// Consulta o cadastro de medicamentos e produtos

// Iniciar
_object._executor = _pin._requestor;

// Obter Metadata
if (!_object)
    return;
    
if (!_object.escolha)
    return;
    
    
if ((_object.escolha === "consultar medicamento")) {
    _metadata.fields.consultarMedicamento.hidden = false;
    _metadata.fields.consultarMedicamento.required = true;
}

if ((_object.escolha === "consultar produto")) {
    _metadata.fields.consultarProduto.hidden = false;
    _metadata.fields.consultarProduto.required = true;
}

// Finalizar
if (!_object)
    throw "Erro ao tentar selecionar medicamento/produto";
    
var vendaMedicamento = {
    nome: _object.nomeMedicamento,
    valor: _object.valorMedicamento,
    quantidade: _object.quantidadeMedicamento,
};

var vendaProduto = {
    nome: _object.nomeProduto,
    valor: _object.valorProduto,
    quantidade: _object.quantidadeProduto,
};

//
// Faz o lançamento da venda para atualizar estoque

// Atender
if (_pin.consultarMedicamento) {
    _object.medicamentoProduto = _pin.consultarMedicamento.nomeMedicamento;
    _object.precoMedicamentoProduto = _pin.consultarMedicamento.precoMedicamento;
    _object.quantidadeEmEstoqueMedicamentoProduto = _pin.consultarMedicamento.quantidadeEmEstoque;
    _object.quantidadeDesejada = _pin.quantidadeDesejada;
}

if (_pin.consultarProduto) {
    _object.medicamentoProduto = _pin.consultarProduto.nomeDoProduto;
    _object.precoMedicamentoProduto = _pin.consultarProduto.precoDoProduto;
    _object.quantidadeEmEstoqueMedicamentoProduto = _pin.consultarProduto.quantidadeDoProduto;
    _object.quantidadeDesejada = _pin.quantidadeDesejada;
}

// Finalizar
if (! _object)
    throw "Erro ao processar venda";

if (_pin.consultarMedicamento) {
    var estoqueAtual = _pin.consultarMedicamento.quantidadeEmEstoque;
    var quantidadeDesejada = _pin.quantidadeDesejada;
    var estoqueAtualizado = estoqueAtual - quantidadeDesejada;
    
    pacoteFarmacia.farmaciaClasseMedicamentoEvelineAlonso._patch({
    "_id": _pin.consultarMedicamento._id,
    _operationsList: [{
        op: "replace",
        path: "/quantidadeEmEstoque",
        value: estoqueAtualizado
        }]
    });
}

if (_pin.consultarProduto) {
    var estoqueAtual = _pin.consultarProduto.quantidadeDoProduto;
    var quantidadeDesejada = _pin.quantidadeDesejada;
    var estoqueAtualizado = estoqueAtual - quantidadeDesejada;
    
    pacoteFarmacia.classeProdutoFarmacia._patch({
    "_id": _pin.consultarProduto._id,
    _operationsList: [{
        op: "replace",
        path: "/quantidadeDoProduto",
        value: estoqueAtualizado
        }]
    });
}

//
// Visualizar Nota Fiscal

// Atender
if (_pin.consultarMedicamento) {
    
    var medicamentoVendido = _pin.consultarMedicamento.nomeMedicamento;
    _object.medicamentoVendido = medicamentoVendido;
    
    var quantidadeMedicamentoVendido = _pin.quantidadeDesejada;
    _object.quantidadeMedicamentoVendido = quantidadeMedicamentoVendido;
    
    var precoMedicamento = _pin.consultarMedicamento.precoMedicamento;
    var quantidadeDesejada = _pin.quantidadeDesejada;
    var valorCompra = precoMedicamento * quantidadeDesejada;
    var valorCompraDuasCasasDecimais = valorCompra.toFixed(2);
    _object.valorDaNota = valorCompraDuasCasasDecimais;
}

if (_pin.consultarProduto) {
    
    var produtoVendido = _pin.consultarProduto.nomeDoProduto;
    _object.produtoVendido = produtoVendido;
    
    var quantidadeProdutoVendido = _pin.quantidadeDesejada;
    _object.quantidadeProdutoVendido = quantidadeProdutoVendido;
    
    var precoProduto = _pin.consultarProduto.nomeDoProduto;
    var quantidadeDesejada = _pin.quantidadeDesejada;
    var valorCompra = precoProduto * quantidadeDesejada;
    var valorCompraDuasCasasDecimais = valorCompra.toFixed(2);
    _object.valorDaNota = valorCompraDuasCasasDecimais;
}

// Finalizar
if (_pin.consultarMedicamento) {
    var venda = {
    medicamentoVendido: _object.medicamentoVendido,
    valorDaVenda: _object.valorDaNota,
    quantidadeMedicamentoVendido: _object.quantidadeDesejada
    };
    
    pacoteFarmacia.farmaciaClasseVendaEvelineAlonso._create(venda);
}

if (_pin.consultarProduto) {
    var venda = {
    produtoVendido: _object.produtoVendido,
    valorDaVenda: _object.valorDaNota,
    quantidadeProdutoVendido: _object.quantidadeDesejada
    };
    
    pacoteFarmacia.farmaciaClasseVendaEvelineAlonso._create(venda);
}