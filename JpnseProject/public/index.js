const wraps = document.getElementById("wrapper");
let randomEntry = null;
let hiraganaList = [];
let katakanaList = [];
let kanjiList = [];
let senList = [];
let vocabList = [];

async function loadHiragana()
{
    try
    {
        const response = await fetch("/api/Hiragana");
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        hiraganaList = await response.json();
        wraps.innerHTML = `
            <table id="define">
                <tbody>
                    <tr>
                        <th colspan="2">
                            <button id="hiraStart">Start Review</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="2">
                            <button id="back">Home</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Hiragana</th>
                        <th>English</th>
                    </tr>
                    ${hiraganaList.map(h => `
                        <tr>
                            <td>${h.Word}</td>
                            <td>${h.Def}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    }
    catch (err)
    {
        console.error("Failed to load Hiragana:", err);
        wraps.innerHTML = `
            <p>Failed to load Hiragana.</p>
            <button id="back">Home</button>
        `;
    }
}

async function startHiraRev()
{
    if(hiraganaList.length === 0)
    {
        wraps.innerHTML = `
            <p>No Hiragana entries available.</p>
            <button id="backHira">Back</button>
        `;
        return;
    }
    randomEntry = hiraganaList[Math.floor(Math.random() * hiraganaList.length)];
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        ${randomEntry.Word}
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputHira" placeholder="Romaji/Hiragana" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="output"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="nextHira">Next</button>
                    </td>
                    <td>
                        <button id="backHira">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function checkInpHira()
{
    const input = document.getElementById("inputHira").value.trim();
    const output = document.getElementById("output");
    if(input === "")
    {
        output.innerHTML = "Enter an answer first!";
        return;
    }
    if(input === randomEntry.Word || input.toLowerCase() === randomEntry.Def.toLowerCase())
    {
        output.innerHTML = "Correct!";
    }
    else
    {
        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Def}
        `;
    }
}

async function loadKatakana()
{
    try
    {
        const response = await fetch("/api/Katakana");
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        katakanaList = await response.json();
        wraps.innerHTML = `
            <table id="define">
                <tbody>
                    <tr>
                        <th colspan="2">
                            <button id="kataStart">Start Review</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="2">
                            <button id="back">Home</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Katakana</th>
                        <th>English</th>
                    </tr>
                    ${katakanaList.map(kt => `
                        <tr>
                            <td>${kt.Word}</td>
                            <td>${kt.Def}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    }
    catch(err)
    {

        console.error("Failed to load Katakana:", err);
        wraps.innerHTML = `
            <p>Failed to load Katakana.</p>
            <button id="back">Home</button>
        `;
    }
}

async function startKataRev()
{
    if (katakanaList.length === 0)
    {
        wraps.innerHTML = `
            <p>No Katakana entries available.</p>
            <button id="backKata">Back</button>
        `;
        return;
    }
    randomEntry = katakanaList[Math.floor(Math.random() * katakanaList.length)];
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        ${randomEntry.Word}
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputKata" placeholder="Romaji/Katakana" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="output"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="nextKata">Next</button>
                    </td>
                    <td>
                        <button id="backKata">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function checkInpKata()
{
    const input = document.getElementById("inputKata").value.trim();
    const output = document.getElementById("output");
    if(input === "")
    {
        output.innerHTML = "Enter an answer first!";
        return;
    }
    if(input === randomEntry.Word || input.toLowerCase() === randomEntry.Def.toLowerCase())
    {
        output.innerHTML = "Correct!";
    }
    else
    {
        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Def}
        `;
    }
}

async function loadKanji()
{
    try
    {
        const response = await fetch("/api/Kanji");
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        kanjiList = await response.json();
        kanjiList.forEach( ka => {
            if(typeof ka.Def === 'string')
            {
                ka.Def = JSON.parse(ka.Def);
            }
        });
        kanjiList.forEach(ka => {
            if(typeof ka.Romanji === 'string')
            {
                ka.Romanji = JSON.parse(ka.Romanji);
            }
        });
        wraps.innerHTML = `
            <table id="define">
                <tbody>
                    <tr>
                        <th colspan="5">
                            <button id="kanjStart">Start Review</button>
                            <button id="kanjAdd">Add Kanji</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="5">
                            <button id="back">Home</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Kanji</th>
                        <th>Romaji</th>
                        <th>Definition</th>
                        <th></th>
                        <th></th>
                    </tr>
                    ${kanjiList.map(ka => `
                         <tr>
                            <td>${ka.Word}</td>
                            <td>${ka.Romanji.join(", ")}</td>
                            <td>${ka.Def.join(", ")}</td>
                            <td>
                                <button class="kanjDel" data-id="${ka.id}">Delete</button>
                            </td>
                            <td>
                                <button class="editKanj" data-id="${ka.id}">Edit</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    }
    catch(err)
    {

        console.error("Failed to load Kanji:", err);
        wraps.innerHTML = `
            <p>Failed to load Kanji.</p>
            <button id="back">Home</button>
        `;
    }
}

async function startKanjRev()
{
    if(kanjiList.length === 0)
    {
        wraps.innerHTML = `
            <p>No Kanji entries available.</p>
            <button id="backKanj">Back</button>
        `;
        return;
    }
    randomEntry = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        ${randomEntry.Word}<br>
                        ${randomEntry.Romanji.join(", ")}
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputKanj" placeholder="English definition" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="output"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="nextKanj">Next</button>
                    </td>
                    <td>
                        <button id="backKanj">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function checkInpKanj()
{
    const input = document.getElementById("inputKanj").value.trim();
    const output = document.getElementById("output");
    if(input === "")
    {
        output.innerHTML = "Enter an answer first!";
        return;
    }

    const correct = randomEntry.Def.some(def =>
        def.trim().toLowerCase() === input.toLowerCase()
    );

    if(correct)
    {
        output.innerHTML = "Correct!";
    }
    else
    {

        output.innerHTML = `
            Incorrect!<br>
            Character: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Romanji.join(", ")}<br>
            Definition: ${randomEntry.Def.join(", ")}
        `;
    }
}

async function addKanji()
{
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        <input id="inputKanjWord" placeholder="Kanji" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputKanjRom" placeholder="Romaji" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputKanjDef" placeholder="Definitions (separated by commas)" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="createKanj">Add Kanji</button>
                    </td>
                    <td>
                        <button id="createKanjBack">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

async function addKanjtoDB()
{
    const inputWord = document.getElementById("inputKanjWord").value.trim();
    const inputRoms = document.getElementById("inputKanjRom").value.split(",").map(def => def.trim()).filter(def => def !== "");
    const inputDefs = document.getElementById("inputKanjDef").value.split(",").map(def => def.trim()).filter(def => def !== "");
    if(!inputWord || inputRoms.length === 0 || inputDefs.length === 0)
    {
        wraps.innerHTML = `
            <p>Please fill in all fields.</p>
            <button id="createKanjBack">Back</button>
        `;
        return;
    }
    try
    {
        const response = await fetch("/api/Kanji", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Word: inputWord,
                Romanji: inputRoms,
                Def: inputDefs
            })
        });
        const result = await response.json();
        if(!response.ok)
        {
            throw new Error(result.error || "Insert failed");
        }
        wraps.innerHTML = `
            <table>
                <tbody>
                    <tr>
                        <td>
                            Word successfully added!
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="inputKanjWord" placeholder="Kanji" type="text">
                        </td>
                    </tr>
                    <tr>
                                           <td>
                            <input id="inputKanjRom" placeholder="Romaji" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="inputKanjDef" placeholder="English definition" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button id="createKanj">Add Kanji</button>
                        </td>
                        <td>
                            <button id="createKanjBack">Back</button>
                        </td>
                        <td>
                            <button id="back">Home</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    catch(err)
    {
        console.error("Failed to add Kanji:", err);
        wraps.innerHTML = `
            <p>Failed to add Kanji.</p>
            <button id="back">Home</button>
        `;
    }
}

async function deleteKanj(id)
{
    try
    {
        const response = await fetch(`/api/Kanji/${id}`, {
            method: "DELETE"
        });

        if(!response.ok)
        {
            throw new Error(`Delete failed: ${response.status}`);
        }
        loadKanji();
    }
    catch(err)
    {
        console.error("Failed to delete Kanji:",err);
    }
}


async function editKanj(id)
{
    const kanj = kanjiList.find(k => k.id == id);
    if(!kanj)
    {
        return;
    }
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        <input id="editKanjWord" value="${kanj.Word}">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="editKanjRom" value="${kanj.Romanji.join(", ")}" placeholder = "Romanji (separated by commas)">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="editKanjDef" value="${kanj.Def.join(", ")}" placeholder = "Definitions (separated by commas)">
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="saveKanjEdit" data-id="${id}">Save</button>
                    </td>
                    <td>
                        <button id="back">Back</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}


async function saveKanj(id)
{
    const Word = document.getElementById("editKanjWord").value;
    const Romanji = document.getElementById("editKanjRom").value.split(",").map(def => def.trim()).filter(def => def !== "");
    const inputDefs = document.getElementById("editKanjDef").value.split(",").map(def => def.trim()).filter(def => def !== "");
    try
    {
        const response =
            await fetch(`/api/Kanji/${id}`, {

                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Word: Word,
                    Romanji: Romanji,
                    Def: inputDefs
                })
            });
        if(!response.ok)
        {
            throw new Error(`Update failed: ${response.status}`);
        }
        loadKanji();
    }
    catch(err)
    {
        console.error("Failed to update Kanji:",err);
    }
}

async function loadSen()
{
    try
    {
        const response = await fetch("/api/Sentences");
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        senList = await response.json();
        wraps.innerHTML = `
            <table id="define">
                <tbody>
                    <tr>
                        <th colspan="4">
                            <button id="senStart">Start Review</button>
                            <button id="senAdd">Add Sentence</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="4">
                            <button id="back">Home</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Sentence</th>
                        <th>Translation</th>
                        <th></th>
                        <th></th>
                    </tr>
                    ${senList.map(se => `
                        <tr>
                            <td>
                                ${se.Sentence}
                            </td>
                            <td>
                                ${se.Def}
                            </td>
                            <td>
                                <button class="senDel" data-id="${se.id}">Delete</button>
                            </td>
                            <td>
                                <button class="editSen" data-id="${se.id}">Edit</button>
                            </td>
                        </tr>
                    `).join("")}
                    </tbody>
            </table>
        `;
    }
    catch (err)
    {
        console.error("Failed to load Sentences:",err);
        wraps.innerHTML = `
            <p>Failed to load Sentences.</p>
            <button id="back">Home</button>
        `;
    }
}

async function startSenReview()
{
    if(senList.length === 0)
    {
        wraps.innerHTML = `
            <p>No sentences available.</p>
            <button id="backSen">Back</button>
        `;
        return;
    }
    randomEntry = senList[Math.floor(Math.random() * senList.length)];
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        ${randomEntry.Sentence}
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputSen" placeholder="English Translation" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="output"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="nextSen">Next</button>
                    </td>
                    <td>
                        <button id="backSen">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}


function checkInpSen()
{
    const input = document.getElementById("inputSen").value.trim();
    const output = document.getElementById("output");
    if(input === "")
    {
        output.innerHTML = "Enter an answer first!";
        return;
    }
    if(input.toLowerCase() === randomEntry.Def.toLowerCase())
    {
        output.innerHTML = "Correct!";
    }
    else
    {
        output.innerHTML = `
            Incorrect!<br>
            Sentence: ${randomEntry.Sentence}<br>
            Definition: ${randomEntry.Def}
        `;
    }
}


async function addSen()
{
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        <input id="inputSenSen" placeholder="Japanese Sentence" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputSenDef" placeholder="English translation" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="createSen">Add Sentence</button>
                    </td>
                    <td>
                        <button id="createSenBack">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

async function addSentoDB()
{
    const inputWord = document.getElementById("inputSenSen").value.trim();
    const inputDef = document.getElementById("inputSenDef").value.trim();
    if(!inputWord || !inputDef)
    {
        wraps.innerHTML = `
            <p>Please fill in all fields.</p>
            <button id="createSenBack">Back</button>
        `;

        return;
    }
    try
    {

        const response = await fetch("/api/Sentences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            Sentence: inputWord,
            Def: inputDef
            })
        });

        const result = await response.json();
        if(!response.ok)
        {
            throw new Error(result.error || "Insert failed");
        }
        wraps.innerHTML = `
            <table>
                <tbody>
                    <tr>
                        <td>
                            Sentence successfully added!
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="inputSenSen" placeholder="Japanese Sentence" type="text">
                        </td>
                    </tr>
                    <tr>
                    <td>
                            <input id="inputSenDef" placeholder="English translation" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button id="createSen">Add Sentence</button>
                        </td>
                        <td>
                            <button id="createSenBack">Back</button>
                        </td>
                        <td>
                            <button id="back">Home</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

    }
    catch(err)
    {
        console.error("Failed to add Sentence:",err);
        wraps.innerHTML = `
            <p>Failed to add Sentence.</p>
            <button id="back">Home</button>
        `;
    }
}


async function deleteSen(id)
{
    try
    {
        const response = await fetch(`/api/Sentences/${id}`, {
            method: "DELETE"
        });
        if(!response.ok)
        {
            throw new Error(`Delete failed: ${response.status}`)
        }
        loadSen();
    }
    catch(err)
    {
        console.error("Failed to delete Sentence:",err);
    }
}


async function editSen(id)
{
    const sen = senList.find(s => s.id == id);
    if(!sen)
    {
        return;
    }
    wraps.innerHTML = `
        <table>
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
                        <button class="saveSenEdit" data-id="${id}">Save</button>
                    </td>
                    <td>
                        <button id="back">Back</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

async function saveSen(id)
{
    const Sentence = document.getElementById("editSenWord").value;
    const Def = document.getElementById("editSenDef").value;
    try
    {
        const response = await fetch(`/api/Sentences/${id}`, {

                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Sentence: Sentence,
                    Def: Def
                })
        });

        if(!response.ok)
        {
            throw new Error(`Update failed: ${response.status}`);
        }
        loadSen();
    }
    catch (err)
    {
        console.error("Failed to update Sentence:",err);
    }
}

async function loadVocab()
{
    try
    {
        const response = await fetch("/api/Glossary");
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        vocabList = await response.json();
        vocabList.forEach(vo => {
            if(typeof vo.Def === 'string')
            {
                vo.Def = JSON.parse(vo.Def);
            }
        });
        vocabList.forEach(vo => {
            if(typeof vo.Romanji === 'string')
            {
                vo.Romanji = JSON.parse(vo.Romanji);
            }
        })
        wraps.innerHTML = `
            <table id="define">
                <tbody>
                    <tr>
                        <th colspan="5">
                            <button id="vocabStart">Start Review</button>
                            <button id="vocabAdd">Add Vocabulary</button>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="5">
                            <button id="back">Home</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Word</th>
                        <th>Romaji</th>
                        <th>Definition</th>
                        <th></th>
                        <th></th>
                    </tr>
                    ${vocabList.map(vo => `
                        <tr>
                        <td>
                                ${vo.Word}
                            </td>
                            <td>
                                ${vo.Romanji.join(", ")}
                            </td>
                            <td>
                                ${vo.Def.join(", ")}
                            </td>
                            <td>
                                <button class="vocabDel" data-id="${vo.id}">Delete</button>
                            </td>
                            <td>
                                <button class="editVocab" data-id="${vo.id}">Edit</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    }
    catch (err)
    {
        console.error("Failed to load Glossary:",err);
        wraps.innerHTML = `
            <p>Failed to load Glossary.</p>
            <button id="back">Home</button>
        `;
    }
}


async function startVocabRev()
{
    if(vocabList.length === 0)
    {
        wraps.innerHTML = `
            <p>No vocabulary entries available.</p>
            <button id="backVocab">Back</button>
        `;
        return;
    }

    randomEntry = vocabList[Math.floor(Math.random() * vocabList.length)];
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        ${randomEntry.Word}<br>
                        ${randomEntry.Romanji.join(", ")}
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputVocab" placeholder="English definition" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="output"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="nextVocab">Next</button>
                    </td>
                    <td>
                        <button id="backVocab">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function checkInpVocab()
{
    const input = document.getElementById("inputVocab").value.trim();
    const output = document.getElementById("output");
    if(input === "")
    {

        output.innerHTML = "Enter an answer first!";
        return;
    }
    const correct = randomEntry.Def.some(def => def.trim().toLowerCase() === input.toLowerCase());
    if(correct)
    {
        output.innerHTML = "Correct!";
    }
    else
    {
        output.innerHTML = `
            Incorrect!<br>
            Word: ${randomEntry.Word}<br>
            Romaji: ${randomEntry.Romanji.join(", ")}<br>
            Definition: ${randomEntry.Def.join(", ")}
        `;
    }
}

async function addVocab()
{
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        <input id="inputVocabWord" placeholder="Japanese Word" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputVocabRom" placeholder="Romaji" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="inputVocabDef" placeholder="English definition" type="text">
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="createVocab">Add Word</button>
                    </td>
                    <td>
                        <button id="createVocabBack">Back</button>
                    </td>
                    <td>
                        <button id="back">Home</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}


async function addVocabtoDB()
{
    const inputWord = document.getElementById("inputVocabWord").value.trim();
    const inputRoms = document.getElementById("inputVocabRom").value.split(",").map(def => def.trim()).filter(def => def !== "");
    const inputDefs = document.getElementById("inputVocabDef").value.split(",").map(def => def.trim()).filter(def => def !== "");
    if(!inputWord || inputRoms.length === 0 || inputDefs.length === 0)
    {
        wraps.innerHTML = `
            <p>Please fill in all fields.</p>
            <button id="createVocabBack">Back</button>
        `;
        return;
    }
    try
    {
        const response = await fetch("/api/Glossary", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Word: inputWord,
                Romanji: inputRoms,
                Def: inputDefs
            })
        });
        const result = await response.json();
        if(!response.ok)
        {
            throw new Error(result.error || "Insert failed");
        }


        wraps.innerHTML = `
            <table>
                <tbody>

                    <tr>
                        <td>
                            Word successfully added!
                        </td>
                     </tr>

                    <tr>
                        <td>
                            <input id="inputVocabWord" placeholder="Japanese Word" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="inputVocabRom" placeholder="Romaji (separated by commas)" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="inputVocabDef" placeholder="English definitions (separated by commas)" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button id="createVocab">Add Word</button>
                        </td>
                        <td>
                            <button id="createVocabBack">Back</button>
                        </td>
                        <td>
                            <button id="back">Home</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    catch (err)
    {
        console.error("Failed to add Word:", err);

        wraps.innerHTML = `
            <p>Failed to add Word.</p>
            <button id="back">Home</button>
        `;
    }
}    

async function deleteVocab(id)
{
    try
    {
        const response = await fetch(`/api/Glossary/${id}`, {
                method: "DELETE"
            });

        if(!response.ok)
        {
            throw new Error(`Delete failed: ${response.status}`);
        }
        loadVocab();
    }
    catch(err)
    {
        console.error("Failed to delete Word:", err);
    }
}


async function editVocab(id)
{
    const vocab = vocabList.find(v => v.id == id);
    if(!vocab)
    {
        return;
    }

    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>
                        <input id="editVocabWord" value="${vocab.Word}">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="editVocabRom" value="${vocab.Romanji.join(", ")}" placeholder="Romanji (separated by commas)">
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="editVocabDef" value="${vocab.Def.join(", ")}" placeholder="Definitions (separated by commas)">
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="saveVocabEdit" data-id="${id}">Save</button>
                    </td>
                    <td>
                        <button id="back">Back</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}


async function saveVocab(id)
{
    const Word = document.getElementById("editVocabWord").value;
    const Romanji = document.getElementById("editVocabRom").value.split(",").map(r => r.trim()).filter(r => r !== "");
    const Defs = document.getElementById("editVocabDef").value.split(",").map(def => def.trim()).filter(def => def !== "");
    try
    {
        const response =
            await fetch(`/api/Glossary/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Word: Word,
                    Romanji: Romanji,
                    Def: Defs
                })
            });
        if(!response.ok)
        {
            throw new Error(`Update failed: ${response.status}`);
        }
        loadVocab();
    }
    catch(err)
    {
        console.error("Failed to update Word:",err);
    }
}

function loadOptions()
{
    wraps.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <th>
                        <button id="hiraRev">Hiragana Review</button>
                    </th>
                    <th>
                        <button id="KataRev">Katakana Review</button>
                    </th>
                </tr>
                <tr>
                    <th colspan="2">
                        <button id="back">Home</button>
                    </th>
                </tr>
            </tbody>
        </table>
    `;
}

function returnHome()
{
    wraps.innerHTML = `
        <table id="main">
            <tbody>
                <tr>
                    <th>
                        <button id="charRev">Character Review</button>
                    </th>
                </tr>
                <tr>
                    <th>
                        <button id="KanRev">Kanji Review</button>
                    </th>
                </tr>
                <tr>
                    <th>
                        <button id="SenPractice">Sentence Practice</button>
                    </th>
                </tr>
                <tr>
                    <th>
                        <button id="VocabRev">Vocabulary</button>
                    </th>
                </tr>
            </tbody>
        </table>
    `;
}

wraps.addEventListener("click", (e) => {

    if(e.target.classList.contains("kanjDel"))
    {
        const id = e.target.dataset.id;
        deleteKanj(id);
        return;
    }

    if(e.target.classList.contains("senDel"))
    {
        const id = e.target.dataset.id;
        deleteSen(id);
        return;
    }

    if(e.target.classList.contains("vocabDel"))
    {
        const id = e.target.dataset.id;
        deleteVocab(id);
        return;
    }

    if(e.target.classList.contains("editKanj"))
    {
        const id = e.target.dataset.id;
        editKanj(id);
        return;
    }

    if(e.target.classList.contains("saveKanjEdit"))
    {
        const id = e.target.dataset.id;
        saveKanj(id);
        return;
    }

    if(e.target.classList.contains("editSen"))
    {
        const id = e.target.dataset.id;
        editSen(id);
        return;
    }

    if(e.target.classList.contains("saveSenEdit"))
    {
        const id = e.target.dataset.id;
        saveSen(id);
        return;
    }

    if(e.target.classList.contains("editVocab"))
    {
        const id = e.target.dataset.id;
        editVocab(id);
        return;
    }

    if(e.target.classList.contains("saveVocabEdit"))
    {
        const id =e.target.dataset.id;
        saveVocab(id);
        return;
    }

    switch(e.target.id)
    {

        case "charRev": loadOptions(); break;
        case "back": returnHome(); break;
        case "hiraRev": loadHiragana(); break;
        case "KataRev": loadKatakana(); break;
        case "KanRev": loadKanji(); break;
        case "kanjStart": startKanjRev(); break;
        case "nextKanj": startKanjRev(); break;
        case "kanjAdd": addKanji(); break;
        case "createKanj": addKanjtoDB(); break;
        case "backKanj": loadKanji(); break;
        case "createKanjBack": loadKanji(); break;
        case "SenPractice": loadSen(); break;
        case "senStart": startSenReview(); break;
        case "nextSen": startSenReview(); break;
        case "senAdd": addSen(); break;
        case "createSen": addSentoDB(); break;
        case "backSen": loadSen(); break;
        case "createSenBack": loadSen(); break;
        case "VocabRev": loadVocab(); break;
        case "vocabStart": startVocabRev(); break;
        case "nextVocab": startVocabRev(); break;
        case "vocabAdd": addVocab(); break;
        case "createVocab": addVocabtoDB(); break;
        case "backVocab": loadVocab(); break;
        case "createVocabBack": loadVocab(); break;
        case "hiraStart": startHiraRev(); break;
        case "nextHira": startHiraRev(); break;
        case "backHira": loadHiragana(); break;
        case "kataStart": startKataRev(); break;
        case "nextKata": startKataRev(); break;
        case "backKata": loadKatakana(); break;
    }
});

wraps.addEventListener("keydown",(e) => {
    if(e.key !== "Enter")
    {
        return;
    }
    e.preventDefault();
    switch(e.target.id)
    {
        case "inputHira": checkInpHira(); break;
        case "inputKata": checkInpKata(); break;
        case "inputKanj": checkInpKanj(); break;
        case "inputSen": checkInpSen(); break;
        case "inputVocab": checkInpVocab(); break;
    }
});

