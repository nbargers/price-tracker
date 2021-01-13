import React, { useEffect } from 'react';
import * as d3 from 'd3';

const DailyPriceChart = (props) => {
    console.log("Props Pricehistory:", props.priceHistory);

    const dateSorter = (datesList) => {
        var dates = datesList,
        orderedDates = datesList.sort(function(a,b){
            return Date.parse(a) > Date.parse(b);
        });
        return orderedDates
    }

    sortedDates = dateSorter(props.priceHistory.map(ele => ele.date))
    console.log("The Sorted Dates are: ", sortedDates)
    
    const drawChart = () => {
    // const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    // const yMinValue = d3.min(priceHistory, d => d.value);
    // const yMaxValue = d3.max(priceHistory, d => d.value);
    // const xMinValue = d3.min(priceHistory, d => d.label);
    // const xMaxValue = d3.max(priceHistory, d => d.label);


    }




    useEffect(() => {drawChart()}, [props.priceHistory]);
    
    return <div id="container" />;

}

export default DailyPriceChart