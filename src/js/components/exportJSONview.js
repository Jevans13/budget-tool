import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Label, Container, Textarea, Select } from "theme-ui"

export default function JSONView() {
    const { spreadsheetId } = useParams();

    const tableData = useSelector((tableData) => tableData.tableData.links);
    const filtered = tableData.filter(item => {
        if (item.spreadsheetId == spreadsheetId)
            return item
    })

    const [monthsArr, setMonthsArr] = useState(filtered[0]);
    const [jsonData, setJsonData] = useState('')


    useEffect(() => {
        getMonth(selectedMonth)

    }, [getMonth, jsonData])

    let keys = []
    if (monthsArr !== undefined) {
        let months = monthsArr.mdTextByMonth;
        for (const month of months) {
            let key = Object.keys(month)
            keys = [...keys, ...key]
        }
    }



    const [selectedMonth, setSelectedMonth] = useState(keys[0]);

    const handleSelect = (value) => {
        setSelectedMonth(value)
        getMonth(value)

    }

    const getMonth = (selectedMonth) => {
        if (selectedMonth !== undefined) {
            let json = monthsArr.actualsByMonth[selectedMonth]
            setJsonData(json)
        }

    }

    const prepJson = () => {
        let json = ""
        if (jsonData !== '') {
            let arr = jsonData
            let newArr = [];
            for (const obj of arr) {
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
            json = JSON.stringify(outputObj, null, 2);
        } else {
            json = ''
        }
        return json
    }

    let result = prepJson()

    return (
        <Container >
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>Choose Month</Label>
                <Select onChange={e => handleSelect(e.target.value)} defaultValue={`${keys[0]}`}>
                    {keys.map(month => {
                        return <option key={month}>{`${month}`}</option>
                    })}
                </Select>
            </Card>
            <Card sx={{ mx: 'auto', mb: 4, my: 2 }}>
                <Label>JSON View</Label>
                <Textarea rows={20} defaultValue={result} />
            </Card>
        </Container>
    )
}