const simulatorBox = document.querySelector('#simulator')
const simulationAnswerBox = document.querySelector('.simulationAnswer')
const simulatorForm = document.querySelector('#simulationDatas')

const teste = (12 / 12).toFixed(1)
async function sendToAPI(infosJson) {
    let config = { 
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: infosJson,
    };

    const infosCaculated = await fetch("http://api.mathjs.org/v4/", config)
    .then((response) => response.json())
    .then((response) => Number(response.result).toFixed(2))

    return infosCaculated
}

function buildHtml(name, monthlyPay, total, contributionTime) {
    simulationAnswerBox.innerHTML = `
        <h3>Olá ${name}</h3>
        <p>Investindo R$ ${monthlyPay.replace('.', ',')} todo mês, você terá ${Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em ${contributionTime} meses (${(contributionTime / 12).toFixed(1).replace('.', ',')} anos)</p>
        <p>Você investiu no total ${(monthlyPay * contributionTime).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <button id="simulateAgainBtn" onclick="simulateAgainBtn()">Simular Novamente</button>
    `
}

simulatorForm.onsubmit = async (e) => {
    e.preventDefault()

    const personName = simulatorForm['name'].value
    let monthlyPay = simulatorForm['monthlyPay'].value
    let interestRate = simulatorForm['interestRate'].value
    const contributionTimeType = simulatorForm['type'].value
    let contributionTime = simulatorForm['contributionTime'].value

    

    monthlyPay = monthlyPay.replace(',', '.')
    interestRate = interestRate.replace(',', '.')

    interestRate /= 100

    if (contributionTimeType == 'year') {
        contributionTime *= 12
    }

    const infos = {
        expr: `${monthlyPay} * (((1 + ${interestRate}) ^ ${contributionTime} - 1) / ${interestRate})`
    }

    const infosJson = JSON.stringify(infos)

    const finalValue = await sendToAPI(infosJson)

    buildHtml(personName, monthlyPay, finalValue, contributionTime)

    simulatorBox.classList.add('showingAnswer')
    simulationAnswerBox.classList.add('showAnswer')
}

function simulateAgainBtn() {
    simulatorBox.classList.remove('showingAnswer')
    simulationAnswerBox.classList.remove('showAnswer')
    simulatorForm['name'].value = ""
    simulatorForm['monthlyPay'].value = ""
    simulatorForm['interestRate'].value = ""
    simulatorForm['type'].value = "year"
    simulatorForm['contributionTime'].value = ""
}