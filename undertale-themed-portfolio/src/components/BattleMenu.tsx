import { useState } from "react"
import PixelButton from "./PixelButton"
import playSelect from "../sfx"

const BATTLE_BUTTONS = [
  { name: 'fight', label: 'Fight' },
  { name: 'act', label: 'Act' },
  { name: 'item', label: 'Item' },
  { name: 'mercy', label: 'Mercy' },
]

function BattleMenu() {
    const [selectIndex, selectSet] = useState(0)

    return (
        <ul className="battle-menu">
            
            

            {BATTLE_BUTTONS.map( (button, index) => (
                <li key={button.name}>
                    <PixelButton {...button} selected={selectIndex === index} onHover={ () => selectSet(index)} onClick={playSelect}/>
                </li>
            ))}
        </ul>
    )
}

export default BattleMenu