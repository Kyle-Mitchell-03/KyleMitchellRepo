wraps = document.getElementById("wrapper");
let randomEntry = null;
let hiraganaList = [];
let katakanaList = [];
let kanjiList = [];
let senList = [];
let vocabList = [];
async function loadHiragana(){
    try {
        const response = await fetch('/api/Hiragana');
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        hiraganaList = await response.json();

        wraps.innerHTML = `
            <table id = "define">
                <tbody>
                    <tr>
                        <th><p><button id="hiraStart">Start Review</button></p></th>
                    </tr>
                    <tr>
                        <th><p>Hiragana | English</p></th>
                    </tr>
                    ${hiraganaList.map(h => `
                        <tr>
                            <td>${h.Word}</td>
                            <td>${h.Def}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <th><p><button id="back">Home</button></p></th>
                    </tr>
                </tbody>
            </table>`;
    } catch (err) {
        console.error('Failed to load hiragana:', err);
        wraps.innerHTML = `<p>Failed to load hiragana. <button id="back">Home</button></p>`;
    }
}

async function startHiraRev() {
    randomEntry = hiraganaList[Math.floor(Math.random() * hiraganaList.length)];

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>${randomEntry.Word}</td>
                </tr>
                <tr>
                    <td><input id="inputHira" placeholder = "Romanji/Hiragana" type="text"></td>
                </tr>
                <tr>
                    <td><div id="output"></div></td>
                </tr>
                <tr>
                    <td><button id="nextHira">Next</button></td>
                    <td><button id="backHira">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function checkInpHira() {
    const input = document.getElementById("inputHira").value.trim();

    if (input === "") {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    if (input === randomEntry.Word || input === randomEntry.Def) {
        output.innerHTML = "Correct!";
    }
    else {
        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Def}
        `;
    }
}

async function loadKatakana(){
    try {
        const response = await fetch('/api/Katakana');
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        katakanaList = await response.json();

        wraps.innerHTML = `
            <table id = "define">
                <tbody>
                    <tr>
                        <th><p><button id="kataStart">Start Review</button></p></th>
                    </tr>
                    <tr>
                        <th><p>Katakana | English</p></th>
                    </tr>
                    ${katakanaList.map(kt => `
                        <tr>
                            <td>${kt.Word}</td>
                            <td>${kt.Def}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <th><p><button id="back">Home</button></p></th>
                    </tr>
                </tbody>
            </table>`;
    } catch (err) {
        console.error('Failed to load Katakana:', err);
        wraps.innerHTML = `<p>Failed to load Katakana. <button id="back">Home</button></p>`;
    }
}

async function startKataRev(){
    randomEntry = katakanaList[Math.floor(Math.random() * katakanaList.length)];

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>${randomEntry.Word}</td>
                </tr>
                <tr>
                    <td><input id="inputKata" placeholder = "Romanji/Katakana" type="text"></td>
                </tr>
                <tr>
                    <td><div id="output"></div></td>
                </tr>
                <tr>
                    <td><button id="nextKata">Next</button></td>
                    <td><button id="backKata">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function checkInpKata(){
    const input = document.getElementById("inputKata").value.trim();

    if (input === "") {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    if (input === randomEntry.Word || input === randomEntry.Def) {
        output.innerHTML = "Correct!";
    }
    else {
        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Def}
        `;
    }
}

async function loadKanji(){
    try {
        const response = await fetch('/api/Kanji');
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        kanjiList = await response.json();

        wraps.innerHTML = `
            <table id = "define">
                <tbody>
                    <tr>
                        <th><p><button id="kanjStart">Start Review</button></p></th>
                        <th><p><button id="kanjAdd">Add Kanji</button></p></th>
                    </tr>
                    <tr>
                        <th><p>Kanji | Romanji | Definition</p></th>
                    </tr>
                    ${kanjiList.map(ka => `
                        <tr>
                            <td>${ka.Word}</td>
                            <td>${ka.Romanji}</td>
                            <td>${ka.Def}</td>
                            <td><p><button class = "kanjDel" data-id = "${ka.id}">Delete</button></p></th>
                            <td><p><button class = "editKanj" data-id = "${ka.id}">Edit</button></p></th>
                        </tr>
                    `).join('')}
                    <tr>
                        <th><p><button id="back">Home</button></p></th>
                    </tr>
                </tbody>
            </table>`;
    } catch (err) {
        console.error('Failed to load Kanji:', err);
        wraps.innerHTML = `<p>Failed to load Kanji. <button id="back">Home</button></p>`;
    }
}

async function startKanjRev(){
    randomEntry = kanjiList[Math.floor(Math.random() * kanjiList.length)];

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>${randomEntry.Word}
                        ${randomEntry.Romanji}</td>
                </tr>
                <tr>
                    <td><input id="inputKanj" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><div id="output"></div></td>
                </tr>
                <tr>
                    <td><button id="nextKanj">Next</button></td>
                    <td><button id="backKanj">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function checkInpKanj(){
    const input = document.getElementById("inputKanj").value.trim();

    if (input === "") {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    if (input === randomEntry.Def) {
        output.innerHTML = "Correct!";
    }
    else {
        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Romanji}<br>
            Defintion: ${randomEntry.Def}
        `;
    }
}

async function addKanji(){
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td><input id="inputKanjWord" placeholder = "Kanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputKanjRom" placeholder = "Romanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputKanjDef" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createKanj">Add Kanji</button></td>
                    <td><button id="createKanjBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function addKanjtoDB(){
    const inputWord = document.getElementById("inputKanjWord").value.trim();
    const inputRom = document.getElementById("inputKanjRom").value.trim();
    const inputDef = document.getElementById("inputKanjDef").value.trim();

    try {
        const response = await fetch('/api/Kanji', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({Word: inputWord, Romanji: inputRom, Def: inputDef})
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || `Insert failed`);
        console.log(result);

        wraps.innerHTML = `
            <table>
            <tbody>
                <tr>
                    <td>Word successfully added!</td>
                </tr>
                <tr>
                    <td><input id="inputKanjWord" placeholder = "Kanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputKanjRom" placeholder = "Romanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputKanjDef" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createKanj">Add Kanji</button></td>
                    <td><button id="createKanjBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`
        
    } catch (err) {
        console.error('Failed to add Kanji:', err);
        wraps.innerHTML = `<p>Failed to add Kanji. <button id="back">Home</button></p>`;
    }
}

async function deleteKanj(id) {
    try {
        const response = await fetch(`/api/Kanji/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        loadKanji();

    } catch(err) {
        console.error("Failed to delete Kanji:", err);
    }
}

async function editKanj(id) {
    const kanj = kanjiList.find(k => k.id == id);
    wraps.innerHTML = 
    `<table>
            <tbody>
                <tr>
                    <td>
                        <input id="editKanjWord" value="${kanj.Word}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <input id="editKanjRom" value="${kanj.Romanji}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <input id="editKanjDef" value="${kanj.Def}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <button class ="saveKanjEdit" data-id="${id}">
                            Save
                        </button>
                    </td>

                    <td>
                        <button id="back">
                            Back
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`;
}

async function saveKanj(id){
    const Word = document.getElementById("editKanjWord").value;
    const Romanji = document.getElementById("editKanjRom").value;
    const Def = document.getElementById("editKanjDef").value;
    await fetch(`/api/Kanji/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Word: Word,
            Romanji: Romanji,
            Def: Def
        })
    });

    loadKanji();
}

async function loadSen(){
    try {
        const response = await fetch('/api/Sentences');
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        senList = await response.json();

        wraps.innerHTML = `
            <table id = "define">
                <tbody>
                    <tr>
                        <th><p><button id="senStart">Start Review</button></p></th>
                        <th><p><button id="senAdd">Add Sentence</button></p></th>
                    </tr>
                    <tr>
                        <th><p>Sentence | Translation</p></th>
                    </tr>
                    ${senList.map(se => `
                        <tr>
                            <td>${se.Sentence}</td>
                            <td>${se.Def}</td>
                            <td><p><button class = "senDel" data-id = "${se.id}">Delete</button></p></th>
                            <td><p><button class = "editSen" data-id = "${se.id}">Edit</button></p></th>
                        </tr>
                    `).join('')}
                    <tr>
                        <th><p><button id="back">Home</button></p></th>
                    </tr>
                </tbody>
            </table>`;
    } catch (err) {
        console.error('Failed to load Sentences:', err);
        wraps.innerHTML = `<p>Failed to load Sentences. <button id="back">Home</button></p>`;
    }
}

async function startSenReview() {
    randomEntry = senList[Math.floor(Math.random() * senList.length)];

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>${randomEntry.Sentence}</td>
                </tr>
                <tr>
                    <td><input id="inputSen" placeholder = "English Translation" type="text"></td>
                </tr>
                <tr>
                    <td><div id="output"></div></td>
                </tr>
                <tr>
                    <td><button id="nextSen">Next</button></td>
                    <td><button id="backSen">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function checkInpSen(){
    const input = document.getElementById("inputSen").value.trim();

    if (input === "") {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    if (input === randomEntry.Def) {
        output.innerHTML = "Correct!";
    }
    else {
        output.innerHTML = `
            Incorrect!<br>
            Sentence: ${randomEntry.Sentence}<br>
            Defintion: ${randomEntry.Def}
        `;
    }
}

async function addSen(){
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td><input id="inputSenSen" placeholder = "Japanese Sentence" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputSenDef" placeholder = "English translation" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createSen">Add Sentence</button></td>
                    <td><button id="createSenBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function addSentoDB(){
    const inputWord = document.getElementById("inputSenSen").value.trim();
    const inputDef = document.getElementById("inputSenDef").value.trim();

    try {
        const response = await fetch('/api/Sentences', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({Sentence: inputWord, Def: inputDef})
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || `Insert failed`);
        console.log(result);

        wraps.innerHTML = `
            <table>
            <tbody>
                <tr>
                    <td>Sentence successfully added!</td>
                </tr>
                <tr>
                    <td><input id="inputSenSen" placeholder = "Japanese Sentence" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputSenDef" placeholder = "English translation" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createSen">Add Sentence</button></td>
                    <td><button id="createSenBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`
        
    } catch (err) {
        console.error('Failed to add Sentence:', err);
        wraps.innerHTML = `<p>Failed to add Sentence. <button id="back">Home</button></p>`;
    }
}

async function deleteSen(id) {
    try {
        const response = await fetch(`/api/Sentences/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        loadSen();

    } catch(err) {
        console.error("Failed to delete Sentence:", err);
    }
}

async function editSen(id) {
    const sen = senList.find(s => s.id == id);
    wraps.innerHTML = 
    `<table>
            <tbody>
                <tr>
                    <td>
                        <input id="editSenWord" value="${sen.Sentence}">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="editSenDef" value="${sen.Def}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <button class ="saveSenEdit" data-id="${id}">
                            Save
                        </button>
                    </td>

                    <td>
                        <button id="back">
                            Back
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`;
}

async function saveSen(id){
    const Sentence = document.getElementById("editSenWord").value;
    const Def = document.getElementById("editSenDef").value;
    await fetch(`/api/Sentences/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Sentence: Sentence,
            Def: Def
        })
    });

    loadSen();
}

//Start of Vocab Functionality

async function loadVocab(){
    try {
        const response = await fetch('/api/Glossary');
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        vocabList = await response.json();

        wraps.innerHTML = `
            <table id = "define">
                <tbody>
                    <tr>
                        <th><p><button id="vocabStart">Start Review</button></p></th>
                        <th><p><button id="vocabAdd">Add Vocabulary</button></p></th>
                    </tr>
                    <tr>
                        <th><p>Word | Romanji | Definition</p></th>
                    </tr>
                    ${vocabList.map(vo => `
                        <tr>
                            <td>${vo.Word}</td>
                            <td>${vo.Romanji}</td>
                            <td>${vo.Def}</td>
                            <td><p><button class = "vocabDel" data-id = "${vo.id}">Delete</button></p></th>
                            <td><p><button class = "editVocab" data-id = "${vo.id}">Edit</button></p></th>
                        </tr>
                    `).join('')}
                    <tr>
                        <th><p><button id="back">Home</button></p></th>
                    </tr>
                </tbody>
            </table>`;
    } catch (err) {
        console.error('Failed to load Glossary:', err);
        wraps.innerHTML = `<p>Failed to load Glossary. <button id="back">Home</button></p>`;
    }
}

async function startVocabRev() {
    randomEntry = vocabList[Math.floor(Math.random() * vocabList.length)];

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>${randomEntry.Word}</td>
                </tr>
                <tr>
                    <td><input id="inputVocab" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><div id="output"></div></td>
                </tr>
                <tr>
                    <td><button id="nextVocab">Next</button></td>
                    <td><button id="backVocab">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function checkInpVocab(){
    const input = document.getElementById("inputVocab").value.trim();

    if (input === "") {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    if (input === randomEntry.Def) {
        output.innerHTML = "Correct!";
    }
    else {
        output.innerHTML = `
            Incorrect!<br>
            Word: ${randomEntry.Word}<br>
            Romanji: ${randomEntry.Romanji}<br>
            Defintion: ${randomEntry.Def}
        `;
    }
}

async function addVocab(){
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td><input id="inputVocabWord" placeholder = "Japanese Word" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputVocabRom" placeholder = "Romanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputVocabDef" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createVocab">Add Word</button></td>
                    <td><button id="createVocabBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`;
}

async function addVocabtoDB(){
    const inputWord = document.getElementById("inputVocabWord").value.trim();
    const inputRom = document.getElementById("inputVocabRom").value.trim();
    const inputDef = document.getElementById("inputVocabDef").value.trim();

    try {
        const response = await fetch('/api/Glossary', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({Word: inputWord, Romanji: inputRom, Def: inputDef})
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || `Insert failed`);
        console.log(result);

        wraps.innerHTML = `
            <table>
            <tbody>
                <tr>
                    <td>Word successfully added!</td>
                </tr>
                <tr>
                    <td><input id="inputVocabWord" placeholder = "Japanese Word" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputVocabRom" placeholder = "Romanji" type="text"></td>
                </tr>
                <tr>
                    <td><input id="inputVocabDef" placeholder = "English definition" type="text"></td>
                </tr>
                <tr>
                    <td><button id="createVocab">Add Word</button></td>
                    <td><button id="createVocabBack">Back</button></td>
                    <td><button id="back">Home</button></td>
                </tr>
            </tbody>
        </table>`
        
    } catch (err) {
        console.error('Failed to add Word:', err);
        wraps.innerHTML = `<p>Failed to add Word. <button id="back">Home</button></p>`;
    }
}

async function deleteVocab(id) {
    try {
        const response = await fetch(`/api/Glossary/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        loadSen();

    } catch(err) {
        console.error("Failed to delete Word:", err);
    }
}

async function editVocab(id) {
    const vocab = vocabList.find(v => v.id == id);
    wraps.innerHTML = 
    `<table>
            <tbody>
                <tr>
                    <td>
                        <input id="editVocabWord" value="${vocab.Word}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <input id="editVocabRom" value="${vocab.Romanji}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <input id="editVocabDef" value="${vocab.Def}">
                    </td>
                </tr>

                <tr>
                    <td>
                        <button class ="saveVocabEdit" data-id="${id}">
                            Save
                        </button>
                    </td>

                    <td>
                        <button id="back">
                            Back
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`;
}

async function saveVocab(id){
    const Word = document.getElementById("editVocabWord").value;
    const Romanji = document.getElementById("editVocabRom").value;
    const Def = document.getElementById("editVocabDef").value;
    await fetch(`/api/Glossary/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Word: Word,
            Romanji: Romanji,
            Def: Def
        })
    });

    loadVocab();
}

//Start of Load Options

function loadOptions(){
    wraps.innerHTML =
        `<table>
                <tbody>
                    <tr>
                        <th>
                            <p>
                                <button id = "hiraRev">Hiragana Review</button>
                            </p>
                        </th>
                        <th>
                            <p>
                                <button id = "KataRev">Katakana Review</button>
                            </p>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <p>
                                <button id = "back">Home</button>
                            </p>
                        </th>
                    </tr>
                </tbody>
            </table>`;
}
function returnHome(){
    wraps.innerHTML =
        `<table id = "main">
                <tbody>
                    <tr>
                        <th>
                            <p>
                                <button id = "charRev">Character Review</button>
                            </p>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <p>
                                <button id = "KanRev">Kanji Review</button>
                            </p>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <p>
                                <button id = "SenPractice">Sentence Practice</button>
                            </p>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <p>
                                <button id = "VocabRev">Vocabulary</button>
                            </p>
                        </th>
                    </tr>
                </tbody>
            </table>`;
}
wraps.addEventListener("click", (e) => {

    if (e.target.classList.contains("kanjDel")) {
        const id = e.target.dataset.id;
        deleteKanj(id);
        return;
    }
    if (e.target.classList.contains("senDel")) {
        const id = e.target.dataset.id;
        deleteSen(id);
        return;
    }
    if (e.target.classList.contains("vocabDel")) {
        const id = e.target.dataset.id;
        deleteVocab(id);
        return;
    }
    if (e.target.classList.contains("editKanj")) {
        const id = e.target.dataset.id;
        editKanj(id);
        return;
    }
    if (e.target.classList.contains("saveKanjEdit")) {
        const id = e.target.dataset.id;
        saveKanj(id);
        return;
    }
    if (e.target.classList.contains("editSen")) {
        const id = e.target.dataset.id;
        editSen(id);
        return;
    }
    if (e.target.classList.contains("saveSenEdit")) {
        const id = e.target.dataset.id;
        saveSen(id);
        return;
    }
    if (e.target.classList.contains("editVocab")) {
        const id = e.target.dataset.id;
        editVocab(id);
        return;
    }
    if (e.target.classList.contains("saveVocabEdit")) {
        const id = e.target.dataset.id;
        saveVocab(id);
        return;
    }

    switch (e.target.id) {
        case "charRev":   loadOptions();  break;
        case "back":      returnHome();   break;
        case "hiraRev":   loadHiragana(); break;
        case "KataRev":   loadKatakana(); break;
        case "KanRev":    loadKanji();    break;
        case "SenPractice": loadSen(); break;
        case "VocabRev": loadVocab(); break;
        case "vocabStart": startVocabRev(); break;
        case "nextVocab": startVocabRev(); break;
        case "vocabAdd": addVocab(); break;
        case "createVocab": addVocabtoDB(); break;
        case "senStart": startSenReview(); break;
        case "nextSen": startSenReview(); break;
        case "senAdd": addSen(); break;
        case "createSen": addSentoDB(); break;
        case "kanjStart": startKanjRev(); break;
        case "nextKanj": startKanjRev(); break;
        case "kanjAdd": addKanji(); break;
        case "createKanj": addKanjtoDB(); break;
        case "hiraStart": startHiraRev(); break;
        case "nextHira": startHiraRev(); break;
        case "backHira": loadHiragana(); break;
        case "backKata": loadKatakana(); break;
        case "backKanj": loadKanji(); break;
        case "backSen": loadSen(); break;
        case "backVocab": loadVocab(); break;
        case "createKanjBack": loadKanji(); break;
        case "createSenBack": loadSen(); break;
        case "createVocabBack": loadVocab(); break;
        case "kataStart": startKataRev(); break;
        case "nextKata": startKataRev(); break;
    }
});
wraps.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        switch (e.target.id) {
            case "inputHira": checkInpHira(randomEntry); break;
            case "inputKata": checkInpKata(randomEntry); break;
            case "inputKanj": checkInpKanj(randomEntry); break;
            case "inputSen" : checkInpSen(randomEntry); break;
            case "inputVocab" : checkInpVocab(randomEntry); break;
        }
    }
});
