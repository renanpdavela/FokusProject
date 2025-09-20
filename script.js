const tagHtml = document.querySelector('html')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const timeDisplayed = document.querySelector('#timer p') // getElementById('timer').querySelector('p')
const startPauseBt = document.querySelector('#start-pause') // getElementById('start-pause')
const startPauseText = document.querySelector('#start-pause span')
const startPauseImg = document.querySelector('#start-pause img')

// Efeitos Sonoros - Mudança de Contexto
const focoSoundEffect = new Audio('/sons/SMB Descendo o tubo.mp3')
const curtoSoundEffect = new Audio('/sons/SMB Message.wav')
const longoSoundEffect = new Audio('/sons/SMB Power-up.mp3')

// Músicas de Fundo
const musicaFocoInput1 = document.querySelector('#alternar-musica1')
const musica1 = new Audio('/sons/Interstellar Main Theme - Hans Zimmer.mp3')
const musicaFocoInput2 = document.querySelector('#alternar-musica2')
const musica2 = new Audio('/sons/Time (Inception) - Hans Zimmer.mp3') // readFile() pode ser usado para carregar o arquivo, mas pode piorar a experiência do usuário. Ao guardar o arquivo em uma variável, quando o projeto for lido, ele já vai carregar o arquivo previamente
musica1.loop = true // Faz a música reiniciar quando terminar de tocar
musica2.loop = true

// Variáveis para o Temporizador
const playSoundEffect = new Audio('/sons/play.wav')
const pauseSoundEffect = new Audio('/sons/pause.mp3')
const endSoundEffect = new Audio('/sons/nave.mp3')
const tempoFocoEmSegundos = 3300
const tempoDescansoCurtoEmSegundos = 300
const tempoDescansoLongoEmSegundos = 900
let tempoTotalEmSegundos = tempoFocoEmSegundos
let tempoDecorridoEmSegundos = tempoTotalEmSegundos
let intervaloId = null

// Trabalhando com atributos:
// Existem várias formas de manipular elementos no DOM. Vejamos 4 desses métodos:
// Seja elemento = document.getElementById('id') a nossa const. Então
// getAttribute: Pega o valor do atributo. 
// Ex.: elemento.getAttribute('data-info')
// setAttribute: Define/modifica o valor do atributo, ou cria um novo atributo se não existir. 
// Ex.: elemento.setAttribute('id', 'novoId')
// Ex.: elemento.setAttribute('src', '/imagens/imagem.png')
// Ex.: elemento.setAttribute('novoAtributo', 'valor')
// hasAttribute: Verifica se o atributo existe e retorna true ou false
// Ex.: elemento.hasAttribute('href')
// removeAttribute: remove o atributo especificado
// Ex.: elemento.removeAttribute('alt')
// Fim

focoBt.addEventListener('click', (event) => { // function(event) {
    focoSoundEffect.play()
    tempoTotalEmSegundos = tempoFocoEmSegundos
    alterarContexto('foco', event)
    // this.classList.add('active') // Não funciona em arrow function
    // event.currentTarget.classList.add('active') // funciona com arrow function / pode ser inserido dentro da função alterarContexto
})

curtoBt.addEventListener('click', (event) => {
    curtoSoundEffect.play()
    tempoTotalEmSegundos = tempoDescansoCurtoEmSegundos
    alterarContexto('descanso-curto', event)
})

longoBt.addEventListener('click', (event) => {
    longoSoundEffect.play()
    tempoTotalEmSegundos = tempoDescansoLongoEmSegundos
    alterarContexto('descanso-longo', event)
})

// Formas de usar o classList:
// Adcionando uma classe com add
// elemento.classList.add('nova-classe')
// Removendo uma classe com remove:
// elemento.classList.remove('classe-a-ser-removida')
// Alternando uma classe com toggle:
// Remove se a classe existir e adiciona se não existir
// elemento.toggle('minha-classe')
// Verificando se a classe está presente com contains: retorna true ou false
// elemento.classList.contains('classe-a-ser-encontrada')
// Substituindo classes: podemos fazer isso usando remove e add em sequência
// Manipulando várias classes ao mesmo tempo:
// Podemos fazer isso usando add e remove passando vários argumentos separados por vírgulas
// elemento.classList.add('classe1', 'classe2', 'classe3')
// elemento.classList.remove('classe1', 'classe2', 'classe3')
// Fim

function alterarContexto(contexto, evento) {
    zerar(tempoTotalEmSegundos)
    exibirTempo()
    // Altera o estilo do botão
    botoes.forEach((botao) => {
        botao.classList.remove('active')
    })
    evento.currentTarget.classList.add('active')
    // Altera o fundo e a imagem
    tagHtml.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    // Altera o texto
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;    
        default: // Caso não encontre nenhum dos casos acima, não retorna nada
            break;
    }
}

musicaFocoInput1.addEventListener('change', () => {
    musicaFocoInput2.checked = false
    musica2.pause()
    musica2.currentTime = 0
    musica1.paused ? musica1.play() : musica1.pause() // play e paused são propriedade do objeto Audio
})

musicaFocoInput2.addEventListener('change', () => {
    musicaFocoInput1.checked = false
    musica1.pause()
    musica1.currentTime = 0
    musica2.paused ? musica2.play() : musica2.pause() // play e paused são propriedade do objeto Audio
})

// Outras propriedades do objeto Audio:
// currentTime: retorna ou define a posição atual de reprodução do áudio, em segundos
// Ex.: musica.currentTime = 10 // Move o áudio para 10 s
// volume: propriedade que retorna ou define o nível de volume do áudio, variando de 0 a 1
// Ex.: musica.volume = 0.5 // Define o volume como 50%

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        endSoundEffect.play()
        zerar(tempoTotalEmSegundos)
        return
    }
    tempoDecorridoEmSegundos -= 1
    exibirTempo()
}

startPauseBt.addEventListener('click', playPause)

function playPause() {
    if(intervaloId) { // Se estiver rodando, irá pausar o intervaloId
        pauseSoundEffect.play()
        pausar() // Não altera o valor da variável tempoDecorridoEmSegundos
        return
    }
    playSoundEffect.play()
    intervaloId = setInterval(contagemRegressiva, 1000) // em ms
    startPauseText.textContent = 'Pausar' // Não usar para inserir tags HTML
    startPauseImg.setAttribute('src','/imagens/pause.png')
    startPauseImg.setAttribute('alt','Pausar')
}

function pausar() {
    clearInterval(intervaloId)
    startPauseText.textContent = 'Começar' // Não usar para inserir tags HTML
    startPauseImg.setAttribute('src','/imagens/play_arrow.png')
    startPauseImg.setAttribute('alt','Começar')
    intervaloId = null
}

function zerar(tempoTotal) {
    pausar()
    tempoDecorridoEmSegundos = tempoTotal
    exibirTempo()
}

function exibirTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000) // Converte de s para ms
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    timeDisplayed.innerHTML = `${tempoFormatado}`
}

exibirTempo()