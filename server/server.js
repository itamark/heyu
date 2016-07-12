var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/heyu');

var Reminder = require('./app/models/reminder');
var User = require('./app/models/user');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
router.use(function (req, res, next) {
    console.log('something is happening');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'welcome to heyu!'});
});

router.route('/reminders')
    .post(function (req, res) {
        var reminder = new Reminder();
        reminder.uid = req.body.uid;
        reminder.text = req.body.text;
        reminder.recurring = req.body.recurring;
        reminder.every = req.body.every;
        reminder.datetime = req.body.datetime;
        reminder.done = req.body.done;


        console.log(typeof req.body.datetime)
        reminder.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Reminder Created!'});
        })
    })
    .get(function (req, res) {
        Reminder.find(function (err, reminders) {
            console.log(reminders);
            if (err) {
                res.send(err);
            }
            res.json(reminders);
        })
    });

router.route('/login')
    .post(function (req, res) {
        console.log(req.body);

        User.findById(req.body.id, function (err, user) {
            if (err) {
                res.send(err);
            }
            if (typeof user !== 'undefined' && user) {
                console.log('exists');

                user.fid = req.body.id || null;
                user.first_name = req.body.cachedUserProfile.first_name || null;
                user.last_name = req.body.cachedUserProfile.last_name || null;
                user.email = req.body.email || null;
                user.timezone = req.body.cachedUserProfile.timezone || null;
                user.image = req.body.profileImageURL || null;
                user.country = req.body.cachedUserProfile.location.name || null;
                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({message: 'User Created!'});
                });
            } else {
                console.log('new');
                var newuser = new User();
                newuser._id = req.body.id || null;
                newuser.first_name = req.body.cachedUserProfile.first_name || null;
                newuser.last_name = req.body.cachedUserProfile.last_name || null;
                newuser.email = req.body.email || null;
                newuser.timezone = req.body.cachedUserProfile.timezone || null;
                newuser.image = req.body.profileImageURL || null;
                if (req.body.cachedUserProfile.location) {
                    newuser.country = req.body.cachedUserProfile.location.name || null;
                }

                newuser.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    console.log('done');

                    res.json({message: 'User Created!'});
                });
            }
            res.json(user);
        });
    });
router.route('/reminders/fulfill/:user_id')
    .get(function (req, res) {
        console.log(req.params.user_id);
        //Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
        //    if (err) return handleError(err);
        //    console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
        //})
        Reminder.findOne({$not: {'uid': req.params.user_id}}, function(err, reminder){
            console.log(reminder);
            if (err) {
                res.send(err);
            }
            res.end(JSON.stringify(reminder));
        })
    });
router.route('/reminders/:reminder_id')
    .get(function (req, res) {
        Reminder.findById(req.params.reminder_id, function (err, reminder) {
            if (err) {
                res.send(err);
            }
            res.json(reminder);
        })
    })
    .put(function (req, res) {
        Reminder.findById(req.params.reminder_id, function (err, reminder) {
            if (err) {
                res.send(err);
            }

            reminder.done = req.body.done;

            reminder.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Reminder Updated!'})
            })
        })
    })
    .delete(function (req, res) {
        Reminder.remove({
            _id: req.params.reminder_id
        }, function (err, reminder) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Reminder Deleted!'})
        })
    });

app.use('/api', router);

app.listen(port);
console.log('magic happens on port' + port);
