const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ChatApp',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
module.exports = mongoose;
