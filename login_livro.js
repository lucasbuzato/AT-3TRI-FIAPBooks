const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/fiapbooks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const LivroSchema = new mongoose.Schema({
  descricao: { type: String},
  fornecedor: { type: String},
  dataDeImpressao: { type: Date},
  quantidadeEmEstoque: { type: Number},
  codigoDoProduto: { type: String, required: true },
});

const Livro = mongoose.model("Livro", LivroSchema);

app.post("/cadastroLivro", async (req, res) => {
  const descricao = req.body.descricao;
  const fornecedor = req.body.fornecedor;
  const dataDeImpressao = req.body.dataDeImpressao;
  const quantidadeEmEstoque = req.body.quantidadeEmEstoque;
  const codigoDoProduto = req.body.codigoDoProduto;

  if (
    descricao == null ||
    fornecedor == null ||
    dataDeImpressao == null ||
    quantidadeEmEstoque == null ||
    codigoDoProduto == null
  ) {
    return res.status(400).json({ error: "Preencha todos os campos!!!" });
  }

  const livroExiste = await Livro.findOne({ codigoDoProduto: codigoDoProduto });

  if (livroExiste) {
    return res.status(400).json({ error: "O código do produto informado já existe" });
  }

  const livro = new Livro({
    descricao: descricao,
    fornecedor: fornecedor,
    dataDeImpressao: dataDeImpressao,
    quantidadeEmEstoque: quantidadeEmEstoque,
    codigoDoProduto: codigoDoProduto,
  });

  try {
    const newLivro = await livro.save();
    res.json({ error: null, msg: "Cadastro de livro ok", LivroId: newLivro._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

const UsuarioSchema = new mongoose.Schema({
  nome : { type: String,},
  email: { type: String, required: true },
  senha: { type: String,}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;
 
  if(nome == null || email == null || senha == null){
    return res.status(400).json({error : "Preenchar todos os campos!!!"});
  }

  const emailExiste = await Usuario.findOne({email : email});

  if(emailExiste){
    return res.status(400).json({error : "O email informado já existe"});
  }

   
  const usuario = new Usuario({
    nome: nome,
    email: email,
    senha: senha
  });


  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
  } catch (error) {}


});

app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/login.html");
});


app.get("/cadastroLivro", async (req, res) => {
  res.sendFile(__dirname + "/cadastroLivro.html");
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
