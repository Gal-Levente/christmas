
/**@type {HTMLDivElement} */
const jsSection = document.createElement("div");
jsSection.id = "jssection";
jsSection.classList.add("hide");
document.body.appendChild(jsSection);

/** @type {HTMLTableElement} */
const table = document.createElement("table");
jsSection.appendChild(table);

/** @type {HTMLTableSectionElement} */
const thead = document.createElement("thead");
table.appendChild(thead);

/** @type {HTMLTableRowElement} */
const headRow = document.createElement("tr");
thead.appendChild(headRow);

/** @type {string[]} */
const headers = ["Osztály", "Manó", "Műszak"];

for (const headerText of headers) {
    /**@type {HTMLTableCellElement} */
    const th = document.createElement("th");
    th.innerText = headerText;
    headRow.appendChild(th);
}

/** @type {HTMLTableSectionElement} */
const tbody = document.createElement("tbody");
tbody.id = "jstbody";
table.appendChild(tbody);

/**@typedef {what: string, who1: string, shift1: string, who2?: string, shift2?: string} Elf */

/** @type {Elf[]} */
const elfs = [
    {
        what: "Logisztika",
        who1: "Kovács Máté",
        shift1: "Délelőttös",
        who2: "Kovács József",
        shift2: "Délutános"
    },
    {
        what: "Könyvelés",
        who1: "Szabó Anna",
        shift1: "Éjszakai"
    }
];

/**
 * @param {Elf} array 
 * @returns {void}
*/
function renderTbody(array) {
    tbody.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        const tr1 = document.createElement("tr");
        tbody.appendChild(tr1);

        const tdWhat = document.createElement("td");
        tdWhat.innerText = array[i].what;
        tr1.appendChild(tdWhat);

        const tdWho1 = document.createElement("td");
        tdWho1.innerText = array[i].who1;
        tr1.appendChild(tdWho1);

        const tdShift1 = document.createElement("td");
        tdShift1.innerText = array[i].shift1;
        tr1.appendChild(tdShift1);

        if (array[i].who2 && array[i].shift2) {
            tdWhat.rowSpan = 2;

            const tr2 = document.createElement("tr");
            tbody.appendChild(tr2);

            const tdWho2 = document.createElement("td");
            tdWho2.innerText = array[i].who2;
            tr2.appendChild(tdWho2);

            const tdShift2 = document.createElement("td");
            tdShift2.innerText = array[i].shift2;
            tr2.appendChild(tdShift2);
        }
    }
}

renderTbody(elfs);
initSelect(elfs);

/**@type {HTMLFormElement} */
const jsForm = document.createElement("form");
jsForm.id = "jsform";
jsSection.appendChild(jsForm);

/**
 * @param {string} id 
 * @param {string} label
 * @returns {void} 
 */
function createInput(id, l) {
    const div = document.createElement("div");
    jsForm.appendChild(div);

    const label = document.createElement("label");
    label.innerText = l;
    label.htmlFor = id;
    div.appendChild(label);

    const input = document.createElement("input");
    input.id = id;
    input.name = id;
    div.appendChild(input);

    const error = document.createElement("span");
    error.classList.add("error");
    div.appendChild(error);
}

/**
 * @param {string} id 
 * @param {string} label 
 * @returns {void}
*/
function createSelect(id, l) {
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.innerText = l;
    label.htmlFor = id;
    div.appendChild(label);

    const select = document.createElement("select");
    select.id = id;

    const empty = document.createElement("option");
    empty.value = "";
    empty.innerText = "Válassz műszakot!";
    select.appendChild(empty);

    const values = [
        { value: "1", text: "Délelőttös" },
        { value: "2", text: "Délutános" },
        { value: "3", text: "Éjszakai" }
    ];

    for (let i = 0; i < values.length; i++) {
        const o = document.createElement("option");
        o.value = values[i].value;
        o.innerText = values[i].text;
        select.appendChild(o);
    }

    div.appendChild(select);

    const error = document.createElement("span");
    error.classList.add("error");
    div.appendChild(error);

    jsForm.appendChild(div);
}

createInput("osztaly", "Osztály");
createInput("mano1", "Manó 1");
createSelect("muszak1", "Manó 1 műszak");

/** @type {HTMLDivElement} */
const checkDiv = document.createElement("div");

/** @type {HTMLInputElement} */
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "masodikmano";
checkDiv.appendChild(checkbox);

/** @type {HTMLLabelElement} */
const checkLabel = document.createElement("label");
checkLabel.innerText = "Két manót veszek fel";
checkLabel.htmlFor = "masodikmano";
checkDiv.appendChild(checkLabel);

jsForm.appendChild(checkDiv);

createInput("mano2", "Manó 2");
createSelect("muszak2", "Manó 2 műszak");

const button = document.createElement("button");
button.innerText = "Hozzáadás";
jsForm.appendChild(button);

initCheckbox(checkbox);

jsForm.addEventListener("submit", handleJSForm);

/**
 * @param {Event} e 
 */
function handleJSForm(e) {
    e.preventDefault();

    /** @type {HTMLInputElement} */
    const osztaly = jsForm.querySelector("#osztaly");
    /** @type {HTMLInputElement} */
    const mano1 = jsForm.querySelector("#mano1");
    /** @type {HTMLSelectElement} */
    const muszak1 = jsForm.querySelector("#muszak1");
    /** @type {HTMLInputElement} */
    const mano2 = jsForm.querySelector("#mano2");
    /** @type {HTMLSelectElement} */
    const muszak2 = jsForm.querySelector("#muszak2");
    /** @type {HTMLInputElement} */
    const masodik = jsForm.querySelector("#masodikmano");

    if (validate(osztaly.value) & validate(mano1.value) & validate(muszak1.value)) {
        /** @type {Elf} */
        const obj = {
            what: osztaly.value,
            who1: mano1.value,
            shift1: mapMuszak(muszak1.value)
        };

        if (masodik.checked) {
            obj.who2 = mano2.value;
            obj.shift2 = mapMuszak(muszak2.value);
        }

        createNewElement(obj, jsForm, elfs);
    }
}

function validate(inputfield) {
    let valid = true;
    if(inputfield == '') {
        const div = inputfield.parentElement;
        const span = div.querySelector('.error');
        span.innerText = "Ez a mező kötelező!";
        valid = false;
    }
    return valid
}

const htmlForm = document.getElementById("htmlform");
htmlForm.addEventListener("submit", handleHTMLForm);

/**
 * @param {Event} e
 */
function handleHTMLForm(e) {
    e.preventDefault();

    /** @type {HTMLFormElement} */
    const form = e.target;
    
    for (const err of form.querySelectorAll(".error")) {
        err.innerText = "";
    }

    /** @type {HTMLSelectElement} */
    const chooser = form.querySelector("#manochooser");
    /** @type {HTMLInputElement} */
    const tev1 = form.querySelector("#manotev1");
    /** @type {HTMLInputElement} */
    const tev2 = form.querySelector("#manotev2");

    if (validate(chooser.value) & validate(tev1.value)) {
        const tbody = document.getElementById("htmltbody");

        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.innerText = chooser.value;
        tr.appendChild(td1);

        const td2 = document.createElement("td");
        td2.innerText = tev1.value;
        tr.appendChild(td2);

        if (tev2.value) {
            const td3 = document.createElement("td");
            td3.innerText = tev2.value;
            tr.appendChild(td3);
        } else {
            td2.colSpan = 2;
        }

        tbody.appendChild(tr);
        form.reset();
    }
}