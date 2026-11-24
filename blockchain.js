// - - - - - - - - - - - - - - - - - - - - 
// Classe et Fonctions de la Blockchain
// - - - - - - - - - - - - - - - - - - - - 
const crypto = require('crypto');
const Block = require('./block');
const fs = require('fs');
const Transaction = require('./transaction');
class Blockchain {
    constructor() {
        this.transactionsEnAttente = [];
        this.recompense = 5;
        this.difficulte = 1;
        this.numeroBloc = 1;
        this.chain = [this.blocGenese()];
        this.chargerBlockchain();
    }
    blocGenese() { // horodatage, transactions, hashPrecedent, difficulte, recompense, adresseRecompense, numeroBloc
        return new Block(1713194312674, [], '0', 1, 0, 'genesis', 0);
    }
    sauvegarderBlockchain() {
        const etat = {
            chain: this.chain,
            recompense: this.recompense,
            difficulte: this.difficulte,
            numeroBloc: this.numeroBloc
        };
        fs.writeFileSync('sauvegardeBlockchain.json', JSON.stringify(etat), 'utf8');
    }

    chargerBlockchain() {
        try {
            const donnees = fs.readFileSync('sauvegardeBlockchain.json', 'utf8');
            const etat = JSON.parse(donnees);
            this.chain = etat.chain || [this.blocGenese()];
            this.recompense = etat.recompense;
            this.difficulte = etat.difficulte;
            this.numeroBloc = etat.numeroBloc;
        } catch (error) {
            console.log('Aucune Blockchain detectee...');
        }
    }

    minerLesTransactions(adresseRecompense) {

        const blocPrecedent = this.chain[this.chain.length - 1];

        const hashPrecedent = blocPrecedent.hash;

        // Creer un nouveau bloc

        let bloc = new Block(Date.now(), this.transactionsEnAttente, hashPrecedent, this.difficulte, this.recompense, adresseRecompense, this.numeroBloc);

        bloc.minerBlock();

        this.chain.push(bloc);

        this.transactionsEnAttente = [
            new Transaction(null, adresseRecompense, this.recompense)
        ];

        console.log("Numéro du bloc: " + this.numeroBloc);

        console.log("Récompense du bloc: " + this.recompense);

        // Ajuster la difficulte

        this.difficulte = this.difficulte * 1.0666;

        // Ajuster la récompense
        if ((this.chain.length % 10) === 0) {
            this.recompense = this.recompense * 0.69;
        }

        // Incrémenter le numéro du bloc

        this.numeroBloc++;

        this.sauvegarderBlockchain();

    }
    creerTransaction(transaction) {
        this.transactionsEnAttente.push(transaction);
    }
    trouverBalanceTotale(adresse) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.deAdresse === adresse) {
                    balance -= trans.montant;
                }
                if (trans.aAdresse === adresse) {
                    balance += trans.montant;
                }
            }
        }
        return balance;
    }

}
module.exports = Blockchain;