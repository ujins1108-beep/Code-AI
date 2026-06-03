const objlist = document.querySelector(".objlist")
const sendbtn = document.querySelector(".sendbtn")
const input = document.querySelector(".input")
const apikeyinput = document.querySelector(".apikeyinput")
const aiselect = document.querySelector(".aiselect")

let API_KEY = null;

apikeyinput.addEventListener("input", () => {
    API_KEY = apikeyinput.value;
})

let question = null;
let response = null;

let AI = "gemini";

let groqhistory = []
let geminihistory = []

aiselect.addEventListener("change", () => {
    AI = aiselect.value;
})

sendbtn.addEventListener("click", async () => {
    if (AI == "gemini") {
        geminifetch()
    }

    if (AI == "groq") {
        groqfetch()
    }
})

async function groqfetch() {
    question = input.value;

    let userbox = document.createElement("div")
    let usermsg = document.createElement("h1")
    usermsg.classList.add("usermsg")
    userbox.classList.add("userbox")
    usermsg.textContent = question
    objlist.appendChild(userbox)
    userbox.appendChild(usermsg)

    groqhistory.push({
        "role": "user",
        "content": question
    })

    input.value = "생각중..."

    response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },

            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: groqhistory
            })
        }
    )

    let data = await response.json()
    let restext = data.choices[0].message.content;
    console.log(restext)

    groqhistory.push({
        "role": "system",
        "content": restext
    })
    console.log(groqhistory)

    input.value = ""

    let resbox = document.createElement("div")
    let resmsg = document.createElement("h1")
    resbox.classList.add("resbox")
    resmsg.classList.add("resmsg")
    resmsg.textContent = restext
    objlist.appendChild(resbox)
    resbox.appendChild(resmsg)

    if (groqhistory.length > 20) {
        groqhistory = groqhistory.slice(-20);
    }
}

async function geminifetch() {
    question = input.value;

    let userbox = document.createElement("div")
    let usermsg = document.createElement("h1")
    usermsg.classList.add("usermsg")
    userbox.classList.add("userbox")
    usermsg.textContent = question
    objlist.appendChild(userbox)
    userbox.appendChild(usermsg)

    geminihistory.push({
        "role": "user",
        "parts": [{
            "text": question
        }]
    })

    input.value = "생각중..."

    response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                "contents": geminihistory
            })
        }
    )

    let data = await response.json()
    let restext = data.candidates[0].content.parts[0].text;
    console.log(restext)
    
    geminihistory.push({
        "role": "model",
        "parts": [{
            "text": restext
        }]
    })
    console.log(geminihistory)

    input.value = ""

    let resbox = document.createElement("div")
    let resmsg = document.createElement("h1")
    resbox.classList.add("resbox")
    resmsg.classList.add("resmsg")
    resmsg.textContent = restext
    objlist.appendChild(resbox)
    resbox.appendChild(resmsg)

    if (geminihistory.length > 20) {
        geminihistory = geminihistory.slice(-20);
    }
}