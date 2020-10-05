const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require('md5');

const url = require('url');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})



app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;


    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    const subscriberHash = md5(subscribingUser.email.toLowerCase());

    mailchimp.setConfig({
        apiKey: '92593f74f6fb69ea88a6baa3a4ccff03-us2',
        server: 'us2'
    });

    const listId = '87c3ed4eee';

    const run = async () => {
        try {
            await mailchimp.lists.getListMember(
                listId,
                subscriberHash
            );
            res.redirect('/');
        }
        catch (e) {
            try {
                const response = await mailchimp.lists.addListMember(listId, {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                })
                res.sendFile(__dirname + "/success.html");
            }
            catch (e) {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    }
    run();

})

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})

//87c3ed4eee

//92593f74f6fb69ea88a6baa3a4ccff03-us2

