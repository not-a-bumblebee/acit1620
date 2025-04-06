import { motion } from "motion/react";

export default function Question(num, choices, answer, pic, delay, offset) {

    console.log("crimesy", choices);


    return (

        <motion.div id={"question-" + num} className="question " initial={{ x: offset, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, delay }}>
            <p>Question #{num+1}. What dog is this?</p>
            <div className="centered">

                <img width={500} src={pic} alt={answer} />
            </div>

            <ul className="options-wrapper">
                {choices.map(x => {
                    return (
                        <li className="choice-wrapper">
                            <input required type="radio" name={num} id={x} value={x} />
                            <label for={x}>{x}</label>
                        </li>)
                })}
            </ul>
        </motion.div>


    )
}