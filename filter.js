//'userinputs' IS THE PARENT DIV OF THE USER INPUTS
var dictionary;
function loadDictionary(){
    //Getting dictionary
    console.log("loadig dict");

    fetch("dictionary.txt")
    .then(response => {return response.text();})
    .then(function(data) {getDictionary(data)})
    .catch(function(error) {console.log(error)});
}

//Set dictionary variable to each line in data
function getDictionary(data){
    dictionary = data.split("\n");
    console.log("finished");
}

function filterWords(){
    //Full input contains all 3 types of characters
    //Useful when comparing yellow letters
    var fullInput = "";

    //Filtered input turns the misplaced characters into a '?'
    var filteredInput = "";

    //Misplaced letters
    var misplacedInput = "";

    //Getting all children of the ui div
    var elements = document.getElementById("userinputs");
    for (const child of elements.children)
    {
        if (child.value.length == 0) fullInput += '?';
        else fullInput += child.value[0];

        if (child.value.length == 0 || child.value.length > 1) filteredInput += '?';
        else filteredInput += child.value;

        //Getting yellow letters
        if (child.value.length == 2) misplacedInput += child.value[0];
    }

    console.log(filteredInput);
    console.log(fullInput);

    var excluded = document.getElementById("exclusion-input").value;
    var inputLength = fullInput.length;
    var matches = [];

    //First pass: Excludes based on known and excluded letters
    for (const w of dictionary)
    {
        if (w.length-1 != inputLength) continue;

        //Checking for excluded characters
        var dictWord = w.toLowerCase().slice(0, -1);
        
        //Bool for both excluded and green letter matches
        var containsExcluded = false;
        for (let i = 0; i < inputLength; i++)
        {
            if (excluded.includes(dictWord[i]) || dictWord[i] != filteredInput[i] && filteredInput[i] != '?')
            {
                containsExcluded = true; 
                break;
            }
        }
        //Github made be do this ;-;
        if (containsExcluded == false && matches.includes(dictWord) == false) matches.push(dictWord);
    }

    var output = [];

    //Second pass: Excludes new list based on yellow characters
    for (const w of matches)
    {
        var containsCounter = 0;

        //For every letter in the words in the matches list
        for (let i = 0; i < inputLength; i++)
        {
            //Will exit if the yellow word is in the "correct place"
            if (w[i] == fullInput[i] && fullInput[i] != filteredInput[i]) break;

            //Counts how many misplaced words are in the word
            if (misplacedInput.includes(w[i])) containsCounter++;
        }
        if (containsCounter == misplacedInput.length) output.push(w);
    }

    console.log(output);

    var outputDisplay = document.getElementById("pagename");

    //Delete current info
    if (outputDisplay.children.length > 0)
    {
        while (outputDisplay.firstChild) 
        {
            outputDisplay.removeChild(outputDisplay.lastChild);
        }
    }
    /*
    var fragList = document.createDocumentFragment();

    //Writing to html file
    output.forEach(data => {
        var li = document.createElement("li");
        li.textContent = data;
        fragList.appendChild(li);
    })
    */

    outputDisplay.innerHTML = fullInput;
}

function keyPress(e){
    //'value' not 'text' >:(
    var text = e.target.value;

    if (text.length > 0 && text[0] != '?')
    {
        //Green text
        e.target.style.backgroundColor = "#82d862";
        //Yellow text
        if (text.length == 2) e.target.style.backgroundColor = "#fecc27";
    }
    //Gray text
    else e.target.style.backgroundColor = "#eaeaea";
}

function changeLetterCount(e){
    var operation = e.target.getAttribute("name");

    if (operation == "+") appendLetter();
    if (operation == "-") removeLetter();
}

function appendLetter(){
    //Creating a new div for a new letter
    var newInput = document.createElement("input");
    newInput.classList.add('input');
    newInput.placeholder = '?';

    var containerDiv = document.getElementById("userinputs");
    containerDiv.append(newInput);

    newInput.addEventListener('input', keyPress);
}

function removeLetter(){
    if (document.getElementById("userinputs").childNodes.length == 0) return false;
    console.log(document.getElementById("userinputs").childNodes.length);
    var parent = document.getElementById("userinputs");
    parent.removeChild(parent.lastElementChild);
}

document.getElementById("pagename").addEventListener("load", loadDictionary);

//Long var name standing for 'Add Remove Letter Button' ;-;
var arlButton = document.getElementsByClassName("add-remove-letters");
arlButton[0].addEventListener("click", changeLetterCount);
arlButton[1].addEventListener("click", changeLetterCount);

//run button down here
document.getElementById("run-button").addEventListener("click", filterWords);

//check to see if the DOM has loaded before getting dictionary?
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDictionary);
} else {
    loadDictionary();
}


