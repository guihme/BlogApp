const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    Categoria.find()
        .sort({date: 'desc'})
        .then((categorias) => {
            res.render('admin/categorias', {categorias: categorias.map(categoria => categoria.toJSON())})
        })
        .catch((err) => {
            req.flash('error_msg', 'houve um erro ao listar categorias!')
            console.log(err)
            res.redirect('/admin')
        })
    
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
        erros.push({text: "Nome inválido"})
    }
    if (!req.body.slug || req.body.slug == null || typeof req.body.slug == undefined) {
        erros.push({text: "Slug inválido"})
    }
    if (req.body.nome.length < 2) {
        erros.push({text: "Nome muito pequeno"})
    }

    if(erros.length > 0) {
        res.render('admin/addcategorias', {erros: erros})
    } else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
            .then(() => {
                req.flash('success_msg', 'categoria criada com sucesso!')
                res.redirect('/admin/categorias')
            })
            .catch((err) => {
                req.flash('error_msg', 'erro ao criar categoria!')
                res.redirect('/admin')
            })
    }

    
})

router.get('/categorias/edit/:id', (req, res) => {
    
    Categoria.findOne({_id: req.params.id}).lean()
        .then((categoria)=>{
            res.render('admin/editcategorias', {categoria: categoria})
        })
        .catch((erros) => {
            req.flash('error_msg', 'essa categoria não existe.')
            res.redirect('/admin/categorias')
        })
    
})

router.post('/categorias/edit', (req, res) => {

    var erros = []

    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
        erros.push({text: "Nome inválido"})
    }
    if (!req.body.slug || req.body.slug == null || typeof req.body.slug == undefined) {
        erros.push({text: "Slug inválido"})
    }
    if (req.body.nome.length < 2) {
        erros.push({text: "Nome muito pequeno"})
    }

   
Categoria.findOne({_id: req.body.id}).lean()
    .then((categoria)=>{
        if(erros.length > 0) {
            res.render('admin/editcategorias', {erros: erros, categoria: categoria})
        } else{
        Categoria.where({_id: req.body.id}).update({nome:req.body.nome, slug:req.body.slug})
            .then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso.')
                res.redirect("/admin/categorias")
            })
            .catch((err) => {
                req.flash('error_msg', 'erro ao salvar.')
                res.redirect("/admin/categorias")
            })
    }})
    .catch((err) => {
        req.flash('error_msg', 'Erro ao editar categoria')
        res.redirect('/admin/categorias')
    })
})

module.exports = router