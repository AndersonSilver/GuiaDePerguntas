const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
// DataBase

// Estou dizendo para o Express usar o EJS como View engine.
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))

connection.authenticate().then(() => {

        console.log("Conexao feita com o banco de dados!!!");

    }).catch((msgErro) => {

        console.log(msgErro);

    })

app.get("/",(req,res) => {

    // Fazendo um busca no meu banco de dados e atraves da função RAW:true esta vindo apenas os dados do banco
    // Esse informação esta sendo salvo na variavel pergunda do arrow Function
    
    Pergunta.findAll({raw:true, order:[
        ['id', 'DESC'] // ASC fica crescente, DESC fica decrescente
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        })
    });
    
});

app.get("/perguntar", (req,res) =>{
    res.render("perguntar")
});

app.post("/salvarperguntas",(req,res) => {

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    });
});

app.get("/pergunta/:id", (req,res) =>{
    let id = req.params.id;

    Pergunta.findOne({
        where: {id:id}
    }).then(pergunta =>{
        if(pergunta != undefined){

            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[
                    ['id','DESC']
                ]
                
            }).then(respostas =>{
                res.render("pergunta",{

                    pergunta: pergunta,
                    respostas: respostas
                });
            }) 
        }else{
            res.redirect("/");
        }
    })
})

app.post("/responder", (req,res) =>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/"+perguntaId);
    })
})

app.listen(3000, (erro) => {
    if(erro){
        console.log("Servidor nao foi aberto");
    }else{
        console.log("Servidor aberto com sucesso http://localhost:3000/");
    }
});