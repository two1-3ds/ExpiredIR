let array1 = [], targetDate = [], IRnumber = [], newIR = [], IRwithTarget = [], arrayExpired = [];
function mainFunction() {
    let strData = document.getElementById("string").value;
    let strDelimiter = ",";
    let regexarray = CSVToArray(strData, strDelimiter);
    let array = regexarray[0];
    splitter(array);
    nowa();
    pureDates();
    let currentWeek = getWeekNumber(new Date());
    let nbofExpIRs = compare(currentWeek).length;
    document.getElementById("result").innerHTML = "It's currently week " + currentWeek[1] + " of " + currentWeek[0] + "<br><br>" +
        "There is " + nbofExpIRs + " expired IRs" + "<br><br>" + display(compare(currentWeek));
}

function CSVToArray(strData, strDelimiter) {
    var objPattern = new RegExp( // Create a regular expression to parse the CSV values.
        ("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + // Delimiters.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + // Quoted fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi"); // Standard fields.
    var arrData = [[]];  // Create an array to hold our data. Give the array a default empty first row
    var arrMatches = null;  // Create an array to hold our individual pattern matching groups.
    while (arrMatches = objPattern.exec(strData)) { // Keep looping over the regular expression matches until we can no longer find a match.
        var strMatchedDelimiter = arrMatches[1]; // Get the delimiter that was found.
        if (strMatchedDelimiter.length && // Check to see if the given delimiter has a length (is not the start of string) and if it matches  field delimiter. If id does not, then we know that this delimiter is a row delimiter.
            strMatchedDelimiter !== strDelimiter) {
            arrData.push([]); // Since we have reached a new row of data, add an empty row to our data array.
        }
        var strMatchedValue;

        if (arrMatches[2]) {  // Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted)
            strMatchedValue = arrMatches[2].replace( // We found a quoted value. When we capture this value, unescape any double quotes.
                new RegExp("\"\"", "g"),
                "\"");
        }
        else {
            strMatchedValue = arrMatches[3]; // We found a non-quoted value.
        }
        arrData[arrData.length - 1].push(strMatchedValue); // Now that we have our value string, let's add it to the data array.
    }

    console.log(arrData);
    console.log(arrData[0].length);
    return arrData;
}

function splitter(array) {
    array1 = [];
    console.log(array); // array ciagiem pisanych wyrazow
    for (let i = 0; i < array.length / 21; i++) {
        array1[i] = []; //array of arrays
        for (let j = i * 21; j < (i + 1) * 21; j++) {
            array1[i].push(array[j]);
        }
    }
    console.log(array1); //array1 to array stworzony z wierszy w każdym tyle samo elementow co w pierwszym wierszu z tytulami
    return array1;
}

function nowa() {
    targetDate = [];
    IRnumber = [];
    for (let i = 0; i < array1.length; i++) {
        targetDate[i] = array1[i][10];
        IRnumber[i] = array1[i][20]
    }
    console.log("TARGET DATES :");
    console.log(targetDate);
    console.log("All IR numbers :");
    console.log(IRnumber);
}

function pureDates() {
    IRwithTarget = [];
    for (let i = 0; i < targetDate.length; i++) {
        if (typeof targetDate[i] !== "undefined") {
            newIR[i] = targetDate[i].replace(/[a-z]/gi, '');
            IRwithTarget.push(newIR[i].split("-"), IRnumber[i]); //push newIRdate splitowane po myslnikach oraz push irnumber
        }
    }
    console.log("IR which has target date :");
    console.log(IRwithTarget);
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
}

function compare(currentWeek) {
    arrayExpired = [];
    for (let i = 2; i < IRwithTarget.length; i++) {
        if (i % 2 == 0) {
            if (IRwithTarget[i][0] <= currentWeek[0] && IRwithTarget[i][1] <= currentWeek[1] + 2) { //porownanie 1 elementu z rokiem i 2 elementu z weekiem
                arrayExpired.push(IRwithTarget[i + 1]);
            }
        }
    }
    return arrayExpired;
}

function display(x) {
    display = x.join("<br>")
    console.log(arrayExpired);
    return display;
}

// TRZEBA DOPROWADZIĆ DO PORZADKU FORMULE POROWNANIA O PRZYPADEK PRZELOMU LAT 
// Not expired
// expired in about 2 weeks