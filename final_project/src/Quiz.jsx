import { useEffect, useRef, useState } from 'react'
import './App.css'
import dogs from './assets/dog.json'
import Question from './Question';
import { motion } from "motion/react";

function Quiz() {
    // saved array of dog questions and answers, and pictures
    const [dogPool, setDogPool] = useState([])

    // used to reference the score element without using query selector
    const scoreRef = useRef(null)


    // shuffle function
    function shuffle(a, b, c, d) {
        c = a.length; while (c) b = Math.random() * (--c + 1) | 0, d = a[c], a[c] = a[b], a[b] = d
    }

    // starts the quiz, resets everything on retry.

    const init = async () => {

        //resets
        scoreRef.current.classList.add("hidden")
        let resetsRef = document.querySelectorAll("form button[type='submit'], form input");
        let colorResetsRef = document.querySelectorAll(".question, .choice-wrapper");
        document.querySelector("#reset-btn").classList.add("hidden")
        document.querySelector("#outcome-speech").innerText = ""
        document.querySelector("#outcome-img").setAttribute("src", "")

        resetsRef.forEach(x => {
            x.disabled = false;
            x.checked = false;
        })
        // removes all the green and red color marks
        colorResetsRef.forEach(x => {
            x.classList.remove("right")
            x.classList.remove("rong")
        })



        // copies the dog array so we can modify it without damaging the master list
        let tempArr = [...dogs]
        let tempQuestions = []

        console.log("Old dog", tempArr);

        shuffle(tempArr)
        console.log("shuffled dogs:", tempArr);


        let questionAmount = 5
        let choiceAmount = 5

        for (let i = 0; i < questionAmount; i++) {

            let question = {}

            let choices = tempArr.splice(0, choiceAmount)

            let answer = choices[Math.floor(Math.random() * ((choiceAmount - 1) - 0) + 0)];

            let pic = await (await fetch(`https://dog.ceo/api/breed/${answer}/images/random/1`)).json()

            // let pic = `https://dog.ceo/api/breed/${answer}/images/random/1`

            question.choices = choices
            question.answer = answer
            question.pic = pic.message[0]

            tempQuestions.push(question)
        }


        console.log("FINAL MIX: ", tempQuestions);
        setDogPool(tempQuestions)
    }

    
    useEffect(() => {
        init()
    }, [])



    console.log(dogPool);



    // get all results 
    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries());

        // needs to be after formdata or else things get fucky
        let allRadioRef = document.querySelectorAll("input, button[type='submit']")
        allRadioRef.forEach(x => {
            x.disabled = true
        })




        console.log("Results: ", formData);
        console.log(data);



        // tally ho

        let finalScore = 0


        dogPool.forEach((x, i) => {
            let tempDaddy = document.querySelector(`#question-${i}`)
            console.log(tempDaddy);
            console.log(x.answer, data[i]);


            if (x.answer == data[i]) {
                finalScore += 1

                tempDaddy.classList.add("right")
                Array.from(tempDaddy.lastChild.children).forEach((choice => {
                    console.log(choice.innerText);

                    choice.innerText == x.answer ? choice.classList.add("right") : null;

                }))
            }
            else {
                tempDaddy.classList.add("rong")
                // gets the container that has all the options
                Array.from(tempDaddy.lastChild.children).forEach((choice => {
                    choice.innerText == x.answer ? choice.classList.add("right") : choice.classList.add("rong");
                    console.log(choice.innerText);

                }))
            }




        })

        scoreRef.current.innerText = `Score: ${finalScore}/${dogPool.length}`
        scoreRef.current.classList.remove("hidden")

        let winPic = "src\\assets\\win.gif"
        let losePic = "src\\assets\\lose.jpg"


        let outcomeSpeech = document.querySelector("#outcome-speech")
        let outcomePic = document.querySelector("#outcome-img")
        document.querySelector("#reset-btn").classList.remove("hidden")

        if (finalScore == dogPool.length) {
            outcomePic.setAttribute("src", winPic)
            outcomeSpeech.innerText = "Congratulations, kid!"
        }
        else {
            outcomePic.setAttribute("src", losePic)
            outcomeSpeech.innerText = "Do better"
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }


    return (
        <motion.div className='static quiz-box' initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>


            <strong className='hidden' ref={scoreRef}>Score</strong>
            <p id='outcome-speech'></p>
            <img width={700} id='outcome-img' src="src\assets\win.gif" alt="" />

            <form action="" onSubmit={handleSubmit}>


                {dogPool && dogPool.map((x, i) => Question(i, x.choices, x.answer, x.pic, 1 + 0.1 * i, i % 2 == 0 ? 50 : -50))}
                <button className='quiz-btn' type='submit' >
                    Submit
                </button>
            </form>


            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); init(); }} id='reset-btn' className='hidden quiz-btn'>Go Again?</button>


        </motion.div>
    )
}

export default Quiz
