//count response and draw chart only when there is a response from every super sector
let response = 0;
let errors = 0;

//superSector Map
const superSector	= {
  '00':	'Total nonfarm',
  '05':	'Total private',
  '06':	'Goods-producing',
  '07':	'Service-providing',
  '08':	'Private service-providing',
  '10':	'Mining and logging',
  '20':	'Construction',
  '30':	'Manufacturing',
  '31':	'Durable Goods',
  '32':	'Nondurable Goods',
  '40':	'Trade, transportation, and utilities',
  '41':	'Wholesale trade',
  '42':	'Retail trade',
  '43':	'Transportation and warehousing',
  '44':	'Utilities',
  '50':	'Information',
  '55':	'Financial activities',
  '60':	'Professional and business services',
  '65':	'Education and health services',
  '70':	'Leisure and hospitality',
  '80':	'Other services',
  '90':	'Government'

};

let sectorCodes = Object.keys(superSector)

// chart_colors map for borderColor
const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  maroon: 'rgb(128,0,0)',
  darkorange: 'rgb(255,140,0)',
  neonyellow: 'rgb(255,255,0)',
  lime: 'rgb(0,255,0)',
  cyan: 'rgb(0,255,255)',
  indigo: 'rgb(75,0,130)',
  dimgrey: 'rgb(105,105,105)',
  tomato: 'rgb(255,99,71)',
  gold: 'rgb(255,215,0)',
  darkgreen: 'rgb(0,100,0)',
  navy: 'rgb(0,0,128)',
  blueviolet: 'rgb(138,43,226)',
  magenta: 'rgb(255,0,255)',
  chocolate: 'rgb(210,105,30)',
  black: 'rgb(0, 0, 0)'
};

let sectorColorBorder = Object.keys(CHART_COLORS)

//chart colors at 50% map for backgroundColor
const CHART_COLORS_50_Percent = {
  red: 'rgb(255, 99, 132, 0.5)',
  orange: 'rgb(255, 159, 64, 0.5)',
  yellow: 'rgb(255, 205, 86, 0.5)',
  green: 'rgb(75, 192, 192, 0.5)',
  blue: 'rgb(54, 162, 235, 0.5)',
  purple: 'rgb(153, 102, 255, 0.5)',
  grey: 'rgb(201, 203, 207, 0.5)',
  maroon: 'rgb(128,0,0, .5)',
  darkorange: 'rgb(255,140,0, 0.5)',
  neonyellow: 'rgb(255,255,0, 0.5)',
  lime: 'rgb(0,255,0, 0.5)',
  cyan: 'rgb(0,255,255 ,0.5)',
  indigo: 'rgb(75,0,130 ,0.5)',
  dimgrey: 'rgb(105,105,105 ,0.5)',
  tomato: 'rgb(255,99,71,0.5)',
  gold: 'rgb(255,215,0,0.5)',
  darkgreen: 'rgb(0,100,0,0.5)',
  navy: 'rgb(0,0,128,0.5)',
  blueviolet: 'rgb(138,43,226, 0.5)',
  magenta: 'rgb(255,0,255, 0.5)',
  chocolate: 'rgb(210,105,30, 0.5)',
  black: 'rgb(0, 0, 0, 0.5)'
};

let sectorColorBackground = Object.keys(CHART_COLORS_50_Percent)

//for labels and data array
const data = {
  labels: [],
  datasets: []
};

//chart information
const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Employees in Thousands'
      }
    }
  }
};

//function to access API values and portray values on chart.js
function responseReceivedHandler() {
    //error pop up if statement if everything fine proceed
    if ((this.status == 200) && (this.response.status == "REQUEST_NOT_PROCESSED") && (errors == 0)) {
      console.log(this.response)
      alert(this.response.message[0] + ". To register for an API Key, go to https://www.bls.gov/developers/. After registering and receiving your API key insert it into the yourAPIKey variable string in line 167 of agarthe_project.js.") //add instructions
      errors++
    } else if (this.status == 200)  {
      console.log(this.response);
      let dataArray = this.response.Results.series[0].data;
      let seriesID = this.response.Results.series[0].seriesID; //want the super sector with seriesID
      let sectorID = seriesID.substring(3,5); //start at 3rd character and include everything up to but not the 5.
      let gridLine = {
        label: [],
        data: [],
        borderColor: [],
        backgroundColor: [],
        hidden: true
      };

      //data array from last record to first record. push to add elements to the end of an array.
      for (let i = dataArray.length - 1; i >= 0; i--) {
        gridLine.data.push(dataArray[i].value)
        if (response == 0) {
        //create x-axis attributes of years in format MM/YYYY
        data.labels.push(dataArray[i].period.substring(1) + "/" + dataArray[i].year)
        }
      }

      //insert the label, borderColor, backgroundColor, and push data for gridline variable
      gridLine.label = superSector[sectorID] //from label in grideline map will look up super sector name in the map
      gridLine.borderColor = CHART_COLORS[sectorColorBorder[response]] //use response number, count down the map and find the key for that place. put key in chart color and return rgb and code for the color.
      gridLine.backgroundColor = CHART_COLORS_50_Percent[sectorColorBackground[response]]

      //add line to data structure and push on list of items we made above
      data.datasets.push(gridLine)
      response ++
    } else {
      console.log("error");
    }

    //create chart to wait for responseReceivedHandler. only create chart if all 22 sectorCode responses are present
    if (response == sectorCodes.length) {
    const myChart = new Chart(
      document.getElementById('myChart'),
        config);
    }
}; //end of responseReceivedHandler function

// for loop for sectorCodes in placement 4-5 in API
for (let i = 0; i < sectorCodes.length; i++) {
  let startQuery = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU" //CEU begins before we put the super sector code
  let endQuery = "00000001?registrationkey="
  let yourAPIKey = "x" //insert your personal API key in this string to replace x

  //request
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseReceivedHandler);
  xhr.responseType = "json";
  xhr.open("GET", startQuery + sectorCodes[i] + endQuery + yourAPIKey);
  xhr.send();
};
//BLS.gov cannot vouch for the data or analyses derived from these data after the data have been retrieved from BLS.gov.
