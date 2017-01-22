var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

function buildMongooseScript(classname, fieldContents)
{
    var mystring = 'var mongoose = require("mongoose");\n'+
       'var '+classname+'Schema = mongoose.Schema(\n'+JSON.stringify(fieldContents)+');\n';

    mystring+= "var "+classname+" = mongoose.model('"+classname+"', "+classname+"Schema);\n";
    mystring+= "module.export = "+classname+";\n";
    console.log(mystring);

    return mystring;
}

app.post('/schema', function(req, res) {

    var classes = req.body;
    var names = [];
    var responseToSend = [];
    for(var i = 0; i < classes.length; i++)
    {
        names.push(classes[i].title);

        var fields = classes[i].fields;

        var fieldContents = {};

        for(var j = 0; j < fields.length; j++) {

            var title = fields[j].name;
            var type = fields[j].type;

            if (type === "Schema.types.ObjectId")
            {
                var relationObject = {};
                relationObject["type"] = "Schema.type.ObjectId";
                relationObject["ref"] = fields[j].ref;

                if (fields[j].reftype == "1tm")
                {
                    var holder = [];
                    holder.push(relationObject);
                    relationObject = holder;
                }

                fieldContents[title] = relationObject;
            }
            else
            {
                fieldContents[title] = type;
            }
        }

        var classname = classes[i].title;

        responseToSend.push(buildMongooseScript(classname, fieldContents));
    }

    res.status(200).send(responseToSend);

});


app.listen(port, function() {
    console.log('Listening on PORT ' + port);
});
