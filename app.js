function swapBlocks() {
  var block1 = document.getElementById("x");
  var block2 = document.getElementById("y");

  var temp = block1.innerHTML;
  block1.innerHTML = block2.innerHTML;
  block2.innerHTML = temp;
}

function calculateArea() {
  var length = parseFloat(document.getElementById("length").value);
  var width = parseFloat(document.getElementById("width").value);

  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
    document.getElementById("area").textContent =
      "Please, provide with correct input";
    return;
  }

  var area = length * width;
  document.getElementById("area").textContent = "Area: " + area;
}

function validateForm() {
  var values = document.getElementById("values").value;
  var numbers = values.split(" ");

  for (var i = 0; i < numbers.length; i++) {
    if (isNaN(numbers[i]) || numbers[i].trim() === "") {
      alert("Please enter valid numbers separated by commas.");
      return false;
    }
  }

  return true;
}

function setCookie(name, value) {
  document.cookie = `${name}=${value}`;
}

function getCookie(name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
}

function findMinMax() {
  var values = document.getElementById("values").value.split(",").map(Number);
  var min = Math.min(...values);
  var max = Math.max(...values);
  return { min, max };
}

function displayResult(min, max) {
  if (min && max) alert(`Min value: ${min}\nMax value: ${max}`);
  else alert(`Please, provide correct values`);
}

var cookieData = getCookie("data");

if (cookieData) {
  var parsedData = JSON.parse(cookieData);
  if (parsedData.min && parsedData.max) {
    var confirmReload = confirm(
      "Have some saved information. Do you want to load it?"
    );
    if (confirmReload) displayResult(parsedData.min, parsedData.max);
    else setCookie("data", "", -1);
  } else {
    setCookie("data", "", -1);
  }
} else {
  document.getElementById("values").style.display = "block";
}

function processData() {
  var result = findMinMax();
  setCookie("data", JSON.stringify(result));
  displayResult(result.min, result.max);
}

function setFontWeight() {
  var checkbox = document.getElementById("boldCheckbox");
  var textBlock = document.getElementById("textBlock");

  if (checkbox.checked) {
    textBlock.style.fontWeight = "bold";
    localStorage.setItem("fontWeight", "bold");
  } else {
    textBlock.style.fontWeight = "normal";
    localStorage.setItem("fontWeight", "normal");
  }
}

var savedFontWeight = localStorage.getItem("fontWeight");

if (savedFontWeight) {
  var checkbox = document.getElementById("boldCheckbox");
  checkbox.checked = savedFontWeight === "bold";
  setFontWeight();
}

document
  .getElementById("boldCheckbox")
  .addEventListener("change", setFontWeight);

function showForm(blockId) {
  var block = document.getElementById(blockId);
  block.innerHTML =
    '<form onsubmit="return createTable(event, ' +
    blockId +
    ')">' +
    '<label for="rows">Number of lines:</label>' +
    '<input type="number" id="rows" min="1" required><br>' +
    '<button type="submit">Create table</button>' +
    "</form>";
}

function createTable(event, blockId) {
  event.preventDefault();

  var rows = document.getElementById("rows").value;
  var block = document.getElementById(blockId);

  var tableHTML = "<table>";
  for (var i = 0; i < rows; i++) {
    tableHTML += "<tr>";
    for (var j = 0; j < 3; j++) {
      tableHTML += "<td>Row " + (i + 1) + ", Col " + (j + 1) + "</td>";
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  block.innerHTML = tableHTML;

  var container = document.createElement("div");
  container.style.textAlign = "center";
  container.style.display = "flex";
  container.style.flexDirection = "column";

  var saveButton = document.createElement("button");
  saveButton.innerText = "Save this table";
  saveButton.onclick = function () {
    saveTableData(blockId, rows, tableHTML);
  };

  container.appendChild(block.firstChild);
  container.appendChild(document.createElement("br"));
  container.appendChild(saveButton);

  block.appendChild(container);
}

function saveTableData(blockId, rows, content) {
  var tableData = JSON.parse(localStorage.getItem("tableData")) || {};
  tableData[blockId] = {
    rows: rows,
    content: content,
  };
  localStorage.setItem("tableData", JSON.stringify(tableData));
  alert("Data of table " + blockId + " has been saved in localStorage");
}

function addClearButton(blockId) {
  var block = document.getElementById(blockId);

  if (!block.querySelector(".clear-button")) {
    var clearButton = document.createElement("button");
    clearButton.innerText = "Delete data of this table";
    clearButton.className = "clear-button";
    clearButton.onclick = function () {
      clearTableData(blockId);
    };
    block.appendChild(clearButton);
  }
}

function clearTableData(blockId) {
  var tableData = JSON.parse(localStorage.getItem("tableData")) || {};

  delete tableData[blockId];

  localStorage.setItem("tableData", JSON.stringify(tableData));
  alert("Data of table " + blockId + " has been deleted from localStorage");

  var block = document.getElementById(blockId);
  var clearButton = block.querySelector(".clear-button");
  if (clearButton) {
    block.removeChild(clearButton);
  }
}

function loadTableData() {
  var tableData = JSON.parse(localStorage.getItem("tableData"));

  if (tableData) {
    for (var blockId in tableData) {
      if (tableData.hasOwnProperty(blockId)) {
        var block = document.getElementById(blockId);
        var data = tableData[blockId];

        block.style.textAlign = "center";
        block.style.display = "flex";
        block.style.flexDirection = "column";

        block.innerHTML = data.content;

        addClearButton(blockId);
      }
    }
  }
}

loadTableData();
