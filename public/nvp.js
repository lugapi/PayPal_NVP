document.addEventListener("DOMContentLoaded", function () {
    var createBillingCheckbox = document.getElementById("create_billing_agreement");
    var billingInfoDiv = document.getElementById("billing_info");

    var batypeValue = document.getElementById('billingtype').value;
    var badescValue = document.getElementById('billingagreementdescription').value;

    if (!createBillingCheckbox.checked) {
        console.log("NOT CHECKED");
        document.getElementById('billingtype').value = "";
        document.getElementById('billingagreementdescription').value = "";
    }

    createBillingCheckbox.addEventListener("change", function () {
        if (this.checked) {
            billingInfoDiv.classList.remove("hidden");
            document.getElementById('billingtype').value = batypeValue;
            document.getElementById('billingagreementdescription').value = badescValue;
        } else {
            billingInfoDiv.classList.add("hidden");
            document.getElementById('billingtype').value = "";
            document.getElementById('billingagreementdescription').value = "";
        }
    });
});

window.paypalCheckoutReady = function () {
    paypal.checkout.setup(sellerId, {
        environment: 'sandbox',
        container: 'paymentForm',
        buttons: [{
            container: [document.getElementById('paymentForm')],
            type: 'checkout',
            color: 'gold',
            size: 'medium',
            shape: 'rect'
        }]
    });
};

document.addEventListener("DOMContentLoaded", function () {
    // Lors du clic sur le bouton "Pay with PayPal NVP"
    document.getElementById("paypalButton").addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien


        // Récupérer l'URL de la route paypal.nvpExecute
        var url = document.getElementById("paypalButton").getAttribute("data-url")

        // Récupérer les valeurs des champs d'entrée
        var amount = document.getElementById("amount").value;
        var localecode = document.getElementById("localecode").value;
        var brandname = document.getElementById("brandname").value;
        var noshipping = document.getElementsByName("noshipping")[0].value;
        var addroverride = document.getElementsByName("addroverride")[0].value;

        var shiptoname = document.getElementsByName("shiptoname")[0].value;
        var shiptocity = document.getElementsByName("shiptocity")[0].value;
        var shiptostreet = document.getElementsByName("shiptostreet")[0].value;
        var shiptostate = document.getElementsByName("shiptostate")[0].value;
        var shiptozip = document.getElementsByName("shiptozip")[0].value;
        var shiptocountrycode = document.getElementsByName("shiptocountrycode")[0].value;

        //BA RT
        var billingtype = document.getElementsByName("billingtype")[0].value;
        var billingagreementdescription = document.getElementsByName("billingagreementdescription")[0].value;

        // Créer un objet contenant les valeurs des champs d'entrée
        var data = {
            amount: amount,
            localecode: localecode,
            brandname: brandname,
            noshipping: noshipping,
            addroverride: addroverride,

            shiptoname: shiptoname,
            shiptocity: shiptocity,
            shiptostreet: shiptostreet,
            shiptostate: shiptostate,
            shiptozip: shiptozip,
            shiptocountrycode: shiptocountrycode,

            billingtype: billingtype,
            billingagreementdescription: billingagreementdescription
        };

        // Effectuer l'appel Fetch vers l'URL avec les données en tant que corps de la requête
        console.log("data ---->", data)
        fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // Rediriger vers l'URL récupérée
                window.location.href = data.redirect_url;
            })
            .catch(error => {
                console.error(error);
            });
    });

    if(getValueFromURL("token") !== null){   
        document.getElementById("response").classList.remove("hidden");
        document.getElementById("tokenID").classList.remove("hidden");
        document.getElementById("tokenID").innerHTML += (getValueFromURL("token"));
        document.getElementById("payerID").classList.remove("hidden");
        document.getElementById("payerID").innerHTML += (getValueFromURL("PayerID"));
    }
});

function getValueFromURL(parameterName) {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Get the value of the specified parameter
    const value = currentUrl.searchParams.get(parameterName);

    console.log(`${parameterName} ---->`, value);

    return value;
}


document.addEventListener("DOMContentLoaded", function () {
    // Lors du clic sur le bouton "Get Express Checkout"
    document.getElementById("callGetExpressCheckout").addEventListener("click", function () {
        const token = getValueFromURL("token")
        var url = "nvpGetExpressCheckout";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // La requête a été traitée avec succès
                    console.log(xhr.responseText);

                    // Décoder les valeurs encodées URL
                    var decodedResponse = xhr.responseText.split("&").map(function (param) {
                        return decodeURIComponent(param.replace(/\+/g, " "));
                    });

                    // Afficher les données formatées dans un élément pre
                    var preElement = document.getElementById("responseGetExpressCheckout");

                    preElement.textContent = decodedResponse;
                    var originalContent = preElement.textContent;
                    var formattedContent = originalContent.replace(/,/g, ",\n");
                    preElement.textContent = formattedContent;

                    preElement.classList.remove("hidden");
                } else {
                    // Une erreur s'est produite lors de la requête
                    console.error("Erreur lors de la requête : " + xhr.status);
                }
            }
        };

        var params = "ECToken=" + encodeURIComponent(token);
        xhr.send(params);
    });

    document.getElementById("callDoExpressCheckout").addEventListener("click", function () {
        var token = getValueFromURL("token");
        var payerID = getValueFromURL("PayerID")
        var url = "nvpDoExpressCheckout";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // La requête a été traitée avec succès
                    console.log(xhr.responseText);

                    // Décoder les valeurs encodées URL
                    var decodedResponse = xhr.responseText.split("&").map(function (param) {
                        return decodeURIComponent(param.replace(/\+/g, " "));
                    });

                    // Formater les données en format JSON
                    //var jsonData = JSON.stringify(decodedResponse, null, 2);

                    // Afficher les données formatées dans un élément pre
                    var preElement = document.getElementById("responseDoExpressCheckout");

                    preElement.textContent = decodedResponse;
                    var originalContent = preElement.textContent;
                    var formattedContent = originalContent.replace(/,/g, ",\n");
                    preElement.textContent = formattedContent;

                    preElement.classList.remove("hidden");
                } else {
                    // Une erreur s'est produite lors de la requête
                    console.error("Erreur lors de la requête : " + xhr.status);
                }
            }
        };

        var params = "ECToken=" + encodeURIComponent(token) + "&payerID=" + encodeURIComponent(payerID);
        xhr.send(params);
    });
});