import  selectSound  from './assets/sounds/snd_select.wav'

const createAudioFromUrl = (url: string): HTMLAudioElement => {
    const audio = new Audio(url)
    audio.preload = 'auto'
    return audio
}

const selectAudio = createAudioFromUrl(selectSound)



const playSelect = () => {
    selectAudio.currentTime = 0
    selectAudio.play().catch( () => {
        console.log("This audio does not exist")
    } )
}




export default playSelect

