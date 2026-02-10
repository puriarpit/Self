public static class Batchtest implements Database.Batchable<sObject>, Database.Stateful{
    public Database.QueryLocator start(Database.BatchableContext BC){
        return Database.getQueryLocator('SELECT Id,Name FROM Account');
    }
    public void execute(Database.BatchableContext BC, List<sObject> scope){
        List<Account> accList = (List<Account>)scope;
        for(Account acc:accList){
            acc.Name = 'Batch Updated';
        }
        update accList;
    }
    public void finish(Database.BatchableContext BC){
        System.debug('Batch Completed');
    }
}