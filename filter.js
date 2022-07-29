//'userinputs' IS THE PARENT DIV OF THE USER INPUTS

function main(){
    //Full input contains all 3 types of characters
    //Useful when comparing yellow letters
    var fullInput = "";

    //Filtered input turns the misplaced characters into a '?'
    var filteredInput = "";

    //Getting all children of the ui div
    var elements = document.getElementById("userinputs");
    for (const child of elements.children)
    {
        fullInput += child.value[0];

        if (child.value.length == 0 || child.value.length > 1) filteredInput += '?';
        else filteredInput += child.value;
    }

    console.log(filteredInput);
    console.log(fullInput);

    //Getting dictionary
    fetch("dictionary.txt")
    .then(function(response){
        return response.text();
    })
    .then(function(data){
        console.log(data);
    })
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

//Long var name standing for 'Add Remove Letter Button' ;-;
var arlButton = document.getElementsByClassName("add-remove-letters");
arlButton[0].addEventListener("click", changeLetterCount);
arlButton[1].addEventListener("click", changeLetterCount)

//run button down here
var runButton = document.getElementById("run-button");
runButton.addEventListener("click", main);
