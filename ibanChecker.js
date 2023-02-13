require('secrets')

function ShowIbanCheck(iban, jsonResponse) {
    var output = `${iban}, ${jsonResponse.message}, ` +
        `${jsonResponse.data.country_name}, ${jsonResponse.data.bank.zip}, ` +
        `${jsonResponse.data.bank.state}, ${jsonResponse.data.bank.city}, ` +
        `${jsonResponse.data.bank.address}, ${jsonResponse.data.bank.bank_name}, ` +
        `${jsonResponse.data.bank.bic}`
    console.log(output);
}


const fs = require('node:fs')
const readLine = require('node:readline')

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
}

const readLineProcess = readLine.createInterface({
    input: fs.createReadStream('placeYourIbans.txt'),
    crlfDelay: Infinity
});

readLineProcess.on('line', (ibanLine) => {
    fetch(`https://api.ibanapi.com/v1/validate/${ibanLine}?api_key=${process.env.API_KEY}`, requestOptions)
        .then(response => {
            if (!response.ok || !response.status.toString().match(/^2\d{2}/)) {
                return response.json()
                    .then(({ message }) => {throw new Error(message || response.status)})
            } else {
                return response.json()
            }
        })
        .then(jsonResult => ShowIbanCheck(ibanLine, jsonResult))
        .catch(error => console.log(`${ibanLine}, ${error}`));
});