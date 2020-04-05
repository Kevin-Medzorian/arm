const express = require('express');
const app = express();
const port = 4000;

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
        res.sendFile("public/index.html");
});

/*app.get('/signin', function (req, res) {
      //  res.render('signin');
});
*/
app.get('/signin', function (req, res) {
        if (!req.body.id || !req.body.password) {
                res.status("400");
                res.send("Invalid details!");
        } else {
                Users.push(req.body.id);
                res.body.error = "yuhhhh";
        }
});

app.listen(port, () => {
        console.log(`Server listening at ${port}`);
});