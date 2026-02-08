import { LightningElement, api, wire } from 'lwc';
import {refreshApex} from '@salesforce/apex';
import {createRecord, updateRecord , getRecord, deleteRecord, getfieldValue} from 'lightning/uiRecordApi';
import {getPicklistValuesByRecordType} from 'lightning/uiObjectInfoApi';
import Status from '@salesforce/schema/Case.Status';
import Account_Name from '@salesforce/schema/Case.AccountId';
import Contact_Name from '@salesforce/schema/Case.ContactId';

export default class QuickCase extends LightningElement {
    @api recordId;
    @api objectApiName;
    caseId;
    statuspicklist;
    prioritypicklist;
    originpicklist;
    status;

    @wire(getPicklistValuesByRecordType, {recordTypeId: '012000000000000AAA', objectApiName: 'Case'})
    picklistValuesByRecordType({data,error}){
        if(data){
            this.statuspicklist = data.picklistFieldValues.Status.values;
            this.prioritypicklist = data.picklistFieldValues.Priority.values;
            this.originpicklist = data.picklistFieldValues.Origin.values;
            console.log('Status Picklist Values', this.statuspicklist);
            console.log('Priority Picklist Values', this.prioritypicklist);
            console.log('Origin Picklist Values', this.originpicklist);
        }
        else if(error){
            console.error('Error fetching picklist values', error);
        }
    }

    @wire(getRecord, {recordId: '$caseId', fields: [Status.fieldApiName]})
    getCaseStatus({data,error}){
        if(data){
            this.status = getfieldValue(data, Status.fieldApiName);
        }
    }
   
    handleClick(){
        const fields = {};
        fields[Status.fieldApiName] = 'New';
        if(this.objectApiName === 'Contact')
            fields[Contact_Name.fieldApiName] = this.recordId;
        else if(this.objectApiName === 'Account'){
            fields[Account_Name.fieldApiName] = this.recordId;
        }
        const recordInput = {apiName: 'Case', fields};
        createRecord(recordInput)
        .then(result => {
            console.log('Case created');
            this.caseId = result.id;
        })
        .catch(error => {
            console.error('Error creating case', error);
        });
    }

    handleUpdate(){
        const fields = {};
        fields[Status.fieldApiName] = 'In Progress';
        fields['Id'] = this.caseId;
        const recordInput = {fields};
        updateRecord(recordInput)
        .then(result => {
            console.log('Case updated');
        })
        .catch(error => {
            console.error('Error updating case', error);
        });
        refreshApex(this.status);
    }

    handleDelete(){
        deleteRecord(this.caseId)
        .then(result => {
            console.log('Case deleted');
        })
        .catch(error => {
            console.error('Error deleting case', error);
        });
        refreshApex(this.status);
    }
}