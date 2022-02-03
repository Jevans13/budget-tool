// import { addData, get } from './mongodb.js';

export default class CrunchData {
    dbData = [];
    expenseTags = [];

    actuals = [];

    constructor() { };



    sumValues(keyName, expenseTag, dataObject) {
        let total = 0;
        for (const object of dataObject) {
            if (object.expenseTag === expenseTag) {
                total += object[keyName]
            }
            // console.log(object[keyName])
        }
        return total;
    }

    getTotalByBudgetVariance(budgetVarianceObj) {
        let total = 0;
        for (const [key, value] of Object.entries(budgetVarianceObj)) {
            if (key !== 'type')
                total += value
        }
        total = Math.round((total + Number.EPSILON) * 100) / 100;
        return total;
        // console.log('total', total)
    }

    getExpenseTags() {
        let duplicateTags = [];
        let expenseTags = []
        for (const object of this.dbData) {
            duplicateTags.push(object.expenseTag)
        }
        // remove duplicates
        expenseTags = [...new Set(duplicateTags)];
        return expenseTags;

    }

    setForecastByExpenseTag() {
        const type = 'forecast2';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.dbData)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setActualsByExpenseTag() {
        const type = 'actual';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.dbData)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setDifferenceByExpenseTag() {
        const type = 'difference';
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.dbData)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }

    setPaymentsByExpenseTag() {
        const type = 'payment'
        let totalByExpenseTag = {};
        totalByExpenseTag.type = type;

        for (const expenseTag of this.expenseTags) {
            totalByExpenseTag[expenseTag] = this.sumValues(type, expenseTag, this.dbData)
        }
        totalByExpenseTag.total = this.getTotalByBudgetVariance(totalByExpenseTag)
        this.actuals.push(totalByExpenseTag)
    }


    crunchData(processedData) {
        this.dbData = processedData;
        this.expenseTags = this.getExpenseTags();
        this.setForecastByExpenseTag();
        this.setActualsByExpenseTag();
        this.setDifferenceByExpenseTag();
        this.setPaymentsByExpenseTag();
        return this.actuals;
    }

    prepJson() {
        let json = ""
        let arr = this.actuals
        let newArr = [];
        for (const obj of arr) {
            console.log(obj)
            let newObj = {}
            for (const key in obj) {
                if (typeof obj[key] === 'number') {
                    newObj[key] = obj[key].toString()
                } else {
                    newObj[key] = obj[key];
                }
            }
            newArr.push(newObj);
            newObj = {};
        }

        let outputObj = { actuals: newArr };
        json = JSON.stringify(outputObj);

        return json;
    }
    // async uploadData() {
    //     console.log('Storing Actuals');
    //     await addData(this.actuals, 'novemberActuals')
    // }

    // async fetchDbData() {
    //     this.dbData = await get('budgetLineItems');
    //     this.expenseTags = this.getExpenseTags()
    //     console.log('fetched dbData: ', this.dbData.length)
    // }

    // console.log(await get('novemberActuals')); 

}



