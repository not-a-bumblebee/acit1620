export default function Intro({callable}) {


    return (
        <div id="intro-box">
            <p>Are you the very best?</p>
            <p>Then take the elite test,</p>
            <p>To see if you really know your pets!</p>
            <button onClick={callable} id="start-btn">Start</button>

        </div>
    )
}