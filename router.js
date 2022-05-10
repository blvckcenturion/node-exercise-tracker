const express = require('express')
const { route } = require('express/lib/application')
const { User, Exercise } = require('./models')

let router = express.Router()

router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send(err)
            return;
        }
        res.json(users)
    })
})

router.post('/users', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.status(500).send(err)
            return;
        }
        if (user) { 
            res.json(user)
            return;
        }
        new User({username: req.body.username}).save((err, u) => { 
            if (err) {
                res.status(500).send(err)
                return;
            }
            res.json({username: u.username, _id: u._id})
        })
    })
})

router.post('/users/:id/exercises', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => { 
        if (err) {
            res.status(500).send(err)
            return;
        }
        if (!user) {
            res.status(404).send('User not found')
            return;
        }
        const ex = { username: user.username, description: req.body.description, duration: req.body.duration }
        req.body.date && (ex.date = req.body.date)
        new Exercise(ex).save((err, exercise) => { 
            if (err) {
                res.status(500).send(err)
                return;
            }

            res.json({
                username: exercise.user,
                description: exercise.description,
                date: exercise.date.toDateString(),
                duration: exercise.duration,
                _id: user._id
            })
        })
    })
})

router.get('/users/:id/log', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => { 
        if (err) {
            res.status(500).send(err)
            return;
        }
        if (!user) {
            res.status(404).send('User not found')
            return;
        }
        const findParams = { user: user.username }
        req.query.from && (findParams.date = { $gte: req.query.from })
        req.query.to && (findParams.date = { $lte: req.query.to })

        Exercise.find(findParams, (err, exercises) => { 
            if (err) {
                res.status(500).send(err)
                return;
            }
            
            req.query.limit && (exercises = exercises.slice(0, req.query.limit))
            res.json({
                username: user.username,
                count: exercises.length,
                _id: user._id,
                log: exercises.map(ex => {
                    return {
                        description: ex.description,
                        duration: ex.duration,
                        date: ex.date.toDateString()
                    }
                })
            })
        })
    })
})



exports.Router = router