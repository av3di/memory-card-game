function Modal(props) {
    return (
      <div className={`overlay ${props.isPlaying ? '' : 'show'}`}>
        <div className="popup">
          <h2>You {props.won ? 'Win!' : 'Lose :\\'}</h2>
          <p>Play again?</p>
          <button onClick={props.handleRestart}>restart game</button>
        </div>
      </div>
    )
};

export default Modal;