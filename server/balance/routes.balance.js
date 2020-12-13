const BalanceController = require('./controllers/balance.controller');

exports.routesConfig = function (router) {

    router.get('/balance/id/:balance', [
        BalanceController.getById
    ]);

    router.get('/balance/getAll', [
        BalanceController.getAll
    ]);

    router.get('/balance/getLast', [
        BalanceController.getLast
    ]);   
    
    router.get('/balance/getFirst', [
        BalanceController.getFirst
    ]);

    router.get('/balance/calculateGains', [
        BalanceController.calculateGains
    ]);
    
    router.post('/balance/add', [
        BalanceController.addBalance
    ]);
};  
