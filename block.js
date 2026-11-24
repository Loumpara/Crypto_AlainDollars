// - - - - - - - - - - - - - - - - - - - - 
// Classe et Fonctions des Blocs
// - - - - - - - - - - - - - - - - - - - - 
const crypto = require('crypto');
class Block {
    constructor(horodatage, transactions, hashPrecedent, difficulte, recompense, adresseRecompense, numeroBloc) {

        this.numeroBloc = numeroBloc;
        this.hashPrecedent = hashPrecedent;
        this.horodatage = horodatage;
        this.difficulte = difficulte;
        this.adresseRecompense = adresseRecompense;
        this.recompense = recompense;
        this.transactions = transactions;
        this.numberOfTransactions = transactions.length;
        this.hash = this.calculerHash();
        this.nonce = 0;
        this.merkleRoot = this.calculerMerkleRoot(transactions);
    }
    calculerHash() {
        return this.SHA256(
            this.hashPrecedent +
            this.horodatage +
            this.nonce +
            this.difficulte +
            this.merkleRoot
        ).toString();
    }

    // Fonction pour calculer un hash avec SHA256
    SHA256(inputString) {
        const steakhashe = crypto.createHash('sha256');
        steakhashe.update(inputString);
        const output = steakhashe.digest('hex');
        console.log(output);
        return output;
    }

    minerBlock() {
        console.log("Difficulté actuelle:", this.difficulte);
        const difficulteInt = Math.max(1, Math.floor(this.difficulte)); // Au moins 1
        const difficulteFrac = this.difficulte - Math.floor(this.difficulte);
        const cibleDeZeros = Array(difficulteInt + 1).join("0");
        const maxHexCar = Math.floor(15 * (1 - difficulteFrac)).toString(16); // Donne 1 caractère

        // Miner! CPU goes BRRRRRRRRRRRR!
        while (true) {
            this.hash = this.calculerHash();
            // console.log(this.hash); // Pour voir les hashes testés.
            if (this.hash.substring(0, difficulteInt) !== cibleDeZeros.substring(0, difficulteInt) ||
                this.hash[difficulteInt] > maxHexCar) {
                this.nonce++;
                continue;
            }
            break;
        }
        console.log("Dernier bloc miné: " + this.hash);
    }

    calculerMerkleRoot(transactions) {
        if (transactions.length === 0) return '';
        const couche = transactions.map(tx => this.SHA256(JSON.stringify(tx)).toString());
        while (couche.length > 1) {
            const nouvelleCouche = [];
            for (let i = 0; i < couche.length; i += 2) {
                if (i + 1 === couche.length) {
                    nouvelleCouche.push(couche[i]);
                } else {
                    nouvelleCouche.push(this.SHA256(couche[i] + couche[i + 1]).toString());
                }
            }
            couche.splice(0, couche.length, ...nouvelleCouche);
        }
        return couche[0];
    }
}
module.exports = Block;