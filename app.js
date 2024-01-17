const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();
const PORT = process.env.PORT || 3000;


const app = express();

app.set("view engine", "ejs");
app.set("views", "public");
app.use(express.static('public'));
app.use(express.json());
// For In Context form
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    try {
        res.render("nvp", {
            title: "PAYPAL Legacy NVP integration",
            documentation: "https://developer.paypal.com/docs/archive/express-checkout/",
            sellerId: process.env.PP_SELLER_ID,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// SET EXPRESS CHECKOUT
app.post('/nvpSetExpressCheckout', async (req, res) => {
    try {
        const postData = {
            USER: process.env.PP_NVP_USER,
            PWD: process.env.PP_NVP_PSWD,
            SIGNATURE: process.env.PP_NVP_SIG,
            METHOD: 'SetExpressCheckout',
            VERSION: process.env.NVP_VERSION,
            PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
            PAYMENTREQUEST_0_AMT: req.body.amount,
            PAYMENTREQUEST_0_CURRENCYCODE: process.env.PP_CURRENCY,
            BRANDNAME: req.body.brandname,
            LOCALECODE: req.body.localecode,
            NOSHIPPING: req.body.noshipping,
            ADDROVERRIDE: req.body.addroverride,
            CANCELURL: 'http://localhost:' + (PORT) || 'https://integration.lugapi.fr/display-request-details',
            RETURNURL: 'http://localhost:' + (PORT) || 'https://integration.lugapi.fr/display-request-details',
            PAYMENTREQUEST_0_SHIPTONAME: req.body.shiptoname,
            L_BILLINGTYPE0: req.body.billingtype,
            L_BILLINGAGREEMENTDESCRIPTION0: req.body.billingagreementdescription
        };

        const response = await axios.post('https://api-3t.sandbox.paypal.com/nvp', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const responseObj = querystring.parse(response.data);
        const URLredirection = `https://www.sandbox.paypal.com/checkoutnow?token=${responseObj.TOKEN}`;

        if (req.body.action && req.body.action === 'incontext') {
            console.log("IN CONTEXT");
            res.redirect(URLredirection);
        } else {
            res.json({
                redirect_url: URLredirection
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// GET EXPRESS CHECKOUT
app.post('/nvpGetExpressCheckout', async (req, res) => {
    try {
        const postData = {
            USER: process.env.PP_NVP_USER,
            PWD: process.env.PP_NVP_PSWD,
            SIGNATURE: process.env.PP_NVP_SIG,
            METHOD: 'GetExpressCheckoutDetails',
            VERSION: '78',
            TOKEN: req.body.ECToken,
        };

        const response = await axios.post('https://api-3t.sandbox.paypal.com/nvp', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        res.json(response.data.split('&'));
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// DO EXPRESS CHECKOUT
app.post('/nvpDoExpressCheckout', async (req, res) => {
    try {
        const postData = {
            USER: process.env.PP_NVP_USER,
            PWD: process.env.PP_NVP_PSWD,
            SIGNATURE: process.env.PP_NVP_SIG,
            METHOD: 'DoExpressCheckoutPayment',
            VERSION: '78',
            TOKEN: req.body.ECToken,
            PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
            PAYMENTREQUEST_0_AMT: '1',
            PAYERID: req.body.payerID,
        };

        const response = await axios.post('https://api-3t.sandbox.paypal.com/nvp', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});