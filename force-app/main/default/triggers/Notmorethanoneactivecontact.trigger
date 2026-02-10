trigger Notmorethanoneactivecontact on Contact (before insert, before Update) {
    Map<Id, Integer> accId = new Map<Id, Integer>();
    set<Id> accIds = new Set<Id>();
    for(Contact c : trigger.new){
        if(c.AccountId != null && c.Status__c == 'Active'){
            accIds.add(c.AccountId);
        }
    }
    for(Contact c : [SELECT Id,AccountId FROM Contact Where AccountId IN :accIds and Status__c = 'Active']){
        if(accId.ContainsKey(c.AccountId)){
            accId.put(c.AccountId, accId.get(c.AccountId) + 1);
        }else{
            accId.put(c.AccountId, 1);
        }   
    }
    for(Contact c : trigger.new){
        if(c.AccountId != null && c.Status__c == 'Active' && accId.get(c.AccountId) >= 1){
            c.addError('Only one active contact is allowed per account');
        }
    }
}