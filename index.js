// - - - - - - - - - - - - - - - - - - - - 
// Classe principale
// Pour partir le projet, node index.js
// - - - - - - - - - - - - - - - - - - - - 
const Blockchain = require('./blockchain');
const crypto = require('crypto');
const Transaction = require('./transaction');
let Blockchain420 = new Blockchain();

function roulerLaBlockchain() {
    console.log("Wake up the minors! We gotta mine some AlainDollars fn");

    const nombreDeTransactions = Math.floor(Math.random() * 41) + 10; // Numero aleatoire entre 10 et 50
    for (let i = 0; i < nombreDeTransactions; i++) {
        const deIndex = Math.floor(Math.random() * adresses.length);
        const aIndex = Math.floor(Math.random() * adresses.length);
        const montant = Math.floor(Math.random() * 100);
        if (deIndex !== aIndex) { // Ne pas s'envoyer soi-même KEKW
            Blockchain420.creerTransaction(new Transaction(adresses[deIndex], adresses[aIndex], montant));
        }
    }

    Blockchain420.minerLesTransactions('Louam');

    console.log(`\nIl y a ${Blockchain420.trouverBalanceTotale('MarcAndreBelisle')} AlainDollars(s) a cette adresse.`);

    
    setTimeout(roulerLaBlockchain, 5 * 1000)
}

function genererAdresses(index) {
    const steakhashe = crypto.createHash('sha256').update(`address_seed_${index}`).digest('hex');
    return base58Encode(Buffer.from(steakhashe, 'hex'));
}

function base58Encode(buffer) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let encode = '';
    let num = BigInt('0x' + buffer.toString('hex'));

    while (num > 0) {
        const rappel = num % BigInt(alphabet.length);
        encode = alphabet[rappel] + encode;
        num = num / BigInt(alphabet.length);
    }

    return encode;
}

const adresses = Array.from({ length: 100 }, (_, i) => genererAdresses(i + 1));
console.log(adresses);

roulerLaBlockchain();