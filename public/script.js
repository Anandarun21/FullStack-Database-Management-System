const addMoreColumnBtn = document.getElementById("add-more-cloumns-btn");
const createTableBtn = document.getElementById("create-table-form-btn");
const addTableButton = document.getElementById("add-table-submit-btn");

const insertDataDiv = document.getElementById("insert-data-div");
const tableListDiv = document.getElementById("tableList");
const tableFormDiv = document.getElementById("table-form-div");
const insertDataBtnDiv = document.getElementById("insert-btn-div");

const tableName = document.getElementById("table-name");
const tableForm = document.getElementById("table-form");

createTableBtn.addEventListener("click", function() {
    tableFormDiv.style.display="block";
    tableForm.style.display = "block";
    insertDataDiv.style.display = "none";
});

addMoreColumnBtn.addEventListener("click", function() {
    const node = document.getElementById("form-div");
    const hiddenNode = document.createElement("div");
    hiddenNode.classList.add("formFields");
    hiddenNode.innerHTML = `
    <div id="hidden-form-div" style="display: inline;" > 
        <label for="column-name">Column Name: <input class="column-name" type="text" placeholder="Student_FullName" required></label>
        <label for="input-datatypes"> DataType: 
            <select name="input-datatypes" class="input-datatypes" required>
                <option value="">Select an option </option>
                <option value="STRING"> STRING </option>
                <option value="INTEGER"> INTEGER </option>
            </select>
        </label>
    </div>
    ` 
    node.appendChild(hiddenNode);

    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.addEventListener("click", function() {
        deletebtn.remove();
        hiddenNode.remove();
    });
    node.appendChild(deletebtn);
});

tableForm.addEventListener("submit", function(e) {
    document.getElementById("table-form-div");
    e.preventDefault();
    const formFields = document.querySelectorAll(".formFields");
    const formData = [];
    
    formFields.forEach(field => {
        const columnName = field.querySelector('.column-name').value;
        const dataType = field.querySelector('.input-datatypes').value;
        formData.push({ columnName, dataType });
    });
    const tableDetails = {
        tableName : tableName.value,
        columnDetails : formData
    }
    tableForm.style.display = "none";
    console.log("***** table Details ********");
    console.log(tableDetails);
    addTable(tableDetails);
});

async function addTable(tableDetails) {
    try {
        const response = await fetch('http://localhost:3000/tableDetails/add-table', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify ( {
                tableName : tableDetails.tableName,
                columnDetails : tableDetails.columnDetails
            }),
        })
        .then(res => {
            location.reload();
            return res.json();
        })
        .then(() => {
            console.log("After Response");
            console.log(tableDetails);
        })
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('load', function () {
    tableList(); 
});

async function tableList() {
    const li = document.getElementById("tableList");
    try {
        const response = await fetch ("http://localhost:3000/tableDetails/getAllTables");
        const tableList = await response.json();
        if (tableList.tableNames.length > 0) {
            tableList.tableNames.forEach((tableName) => {
                const p = document.createElement("p");
                const textNode = document.createTextNode(tableName);
                p.appendChild(textNode);
                li.appendChild(p);
            });
        } 
    } catch (error) {
        console.log(error);
    }
}

let currentTableName = null;
tableListDiv.addEventListener("click", async function (event) {
    tableFormDiv.style.display = "none";
    insertDataDiv.style.display = "block";
    if (event.target.tagName === 'P') {
        const clickedTableName = event.target.textContent;
        if (currentTableName !== clickedTableName) {
            currentTableName = clickedTableName;
            insertDataDiv.style.display = "block";
            clearInsertButton();
            clearDisplayedTable(); 
            clearDynamicForm();
            viewData(clickedTableName);
        } 
    }
});

function clearDisplayedTable() {
    const displayTableData = document.getElementById('display-table-data');
    displayTableData.innerHTML = '';
}

function clearInsertButton() {
    const displayInsertBtn  = document.getElementById("insert-btn-div");
    displayInsertBtn.innerHTML ='';
}
function clearDynamicForm() {
    const dynamicForm = document.getElementById("dynamic-form");
    dynamicForm.innerHTML='';
}

async function viewData(tableName) {
    const insertDataBtn = document.createElement("button");
    insertDataBtn.textContent="Insert data";
    insertDataBtnDiv.appendChild(insertDataBtn);
    insertDataBtnDiv.style.display = "block";
    insertDataBtn.addEventListener("click", function () {
        dynamicInputFieldForm(tableName);
    });
    try {
        const response = await fetch(`http://localhost:3000/tableDetails/getTable/${tableName}`);
        if (response.ok) {
            const tableData = await response.json();
            console.log("Table Data:", tableData);
            if(tableData.tableData.length > 0) {
                displayTable(tableData, tableName);
            }
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error(error);
    }
}

function displayTable(tableData, tableName) {
    const tableElement = document.createElement("table");
    const headers = Object.keys(tableData.tableData[0]);
    const headerRow = document.createElement('tr');
    headers.forEach( (header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableElement.appendChild(headerRow);
    tableData.tableData.forEach( (row) => {
        const tr = document.createElement("tr");
        headers.forEach( ( header) => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";   
        deleteBtn.id = row.id;
        deleteBtn.addEventListener("click", function() {
            console.log(`Delete row with ID: ${deleteBtn.id}`);
            deleteDataRow(tableName, deleteBtn.id);
        });
        const tdWithButton = document.createElement('td');
        tdWithButton.appendChild(deleteBtn);
        tr.appendChild(tdWithButton);
        tableElement.appendChild(tr);
    });
    document.getElementById('display-table-data').appendChild(tableElement);
}


async function deleteDataRow(tableName, rowID) {
    try {
        const response = await fetch(`http://localhost:3000/tableDetails/deleteRow/${tableName}/${rowID}`, {
            method: 'DELETE',
        })
        .then (location.reload() )
        .then(viewData(tableName));
    } catch(err) {
        console.log(err);
    }
}

async function dynamicInputFieldForm(tableName) {
    const insertDataDiv = document.getElementById("insert-data-div");
    insertDataDiv.innerHTML = ''; 

    try {
        const response = await fetch(`http://localhost:3000/tableDetails/getColumns/${tableName}`);
        if (response.ok) {
            const tableColumns = await response.json();
            console.log("Inside Dynamic Field Form ", tableColumns);
            const form = document.createElement("form");
            form.addEventListener("submit", async function (e) {
                e.preventDefault();
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                console.log(data);
                try {
                    const insertResponse = await fetch(`http://localhost:3000/tableDetails/insertData/${tableName}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    .then(response => { 
                        return response.json();
                    })
                    .then( location.reload());
                } catch (error) {
                    console.error(error);
                }
            });

            for (const column in tableColumns.tableDetails) {
                if ( (column != 'id') && (column!= 'createdAt') && (column != 'updatedAt')) {
                    const label = document.createElement('label');
                    const columnName = column;
                    label.textContent = `${columnName}: `;
                    const input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.setAttribute('name', column); 
                    input.setAttribute('required', 'true');
                    label.appendChild(input);
                    form.appendChild(label);
                }
            }
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.textContent = 'Insert Data';
            form.appendChild(submitButton);
            insertDataDiv.appendChild(form);
            insertDataDiv.style.display = 'block';
        } else {
            throw new Error('Failed to fetch columns');
        }
    } catch (error) {
        console.error(error);
    }
}

