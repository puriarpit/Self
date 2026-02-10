@RestResource(name='test', urlMapping='/test/*')
global with sharing class ContactRest {
    @HttpPut
    global static void  doUpsert() {
       List<Contact> conIdtoupsert = new List<Contact>(); 
       RestRequest req = RestContext.request;
       String jsonBody = req.requestBody.toString();
       List<Object> contactsRaw = (List<Object>) JSON.deserializeUntyped(jsonBody);

        for(Object contacsRaw : contacts) {
            Map<string, Object> contactMap = (Map<String, Object>)contacsRaw;
            Contact con = new Contact();
            con.Id = (Id)contactMap.get('Id') ?? null;
            con.LastName = (String)contactMap.get('LastName') ?? null;
            con.Email = (String)contactMap.get('Email') ?? null;
            conIdtoupsert.add(con);
        }
        if(!conIdtoupsert.isEmpty()){
             Database.upsert(conIdtoupsert,false);
        }
    }
}