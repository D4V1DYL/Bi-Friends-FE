import styled from 'styled-components';

const Checkbox = () => {
  return (
    <StyledWrapper>
      <label className="checkboxLabel" htmlFor="checkbox">
        <input id="checkbox" name="checkbox" type="checkbox" />
        <span id="bar1" className="bar" />
        <span id="bar2" className="bar" />
        <span id="bar3" className="bar" />
        <span id="bar4" className="bar" />
        <span id="bar5" className="bar" />
        <span id="bar6" className="bar" />
        <span id="bar7" className="bar" />
        <span id="bar8" className="bar" />
        <span id="nut1" className="nut" />
        <span id="nut2" className="nut" />
        <span id="nut3" className="nut" />
        <span id="nut4" className="nut" />
        <span id="nut5" className="nut" />
        <span id="nut6" className="nut" />
        <span id="nut7" className="nut" />
        <span id="nut8" className="nut" />
        <span className="cover" />
        <span className="cover2">
          <div className="inCover2">
            <div className="rainbow">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </span>
        <svg className="lock" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g strokeWidth={0} id="SVGRepo_bgCarrier" />
          <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
          <g id="SVGRepo_iconCarrier">
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="#2A3439" d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" />
          </g>
        </svg>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkboxLabel {
    --rotate-offset: 45deg;
    --time-offset: 150ms;
    --translate-offset: 0.6rem;
    --delay: 180ms;
    --total-duration: calc(var(--time-offset) + var(--delay) * 7);
    margin-top: 15px;

    position: relative;
    height: 1.5rem; /* <<< UBAH UKURAN UTAMA DI SINI */
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform var(--total-duration) ease-in-out;
  }

  .bar {
    position: absolute;
    height: 1.5rem;
    width: 0.1rem;
    border-radius: 0.05rem;
    background-color: white;
    top: -50%;
    transform-origin: bottom;
    z-index: 0;
  }

  #bar1 { rotate: 45deg; transition-delay: 0ms; }
  #bar2 { rotate: 90deg; transition-delay: 180ms; }
  #bar3 { rotate: 135deg; transition-delay: 360ms; }
  #bar4 { rotate: 180deg; transition-delay: 540ms; }
  #bar5 { rotate: 225deg; transition-delay: 720ms; }
  #bar6 { rotate: 270deg; transition-delay: 900ms; }
  #bar7 { rotate: 315deg; transition-delay: 1080ms; }
  #bar8 { rotate: 360deg; transition-delay: 1260ms; }

  #bar1, #bar2, #bar3, #bar4, #bar5, #bar6, #bar7, #bar8 {
    transition: all var(--time-offset) ease-in;
    transform: translateY(calc(var(--translate-offset) * -1));
  }

  #checkbox:checked ~ #bar1,
  #checkbox:checked ~ #bar2,
  #checkbox:checked ~ #bar3,
  #checkbox:checked ~ #bar4,
  #checkbox:checked ~ #bar5,
  #checkbox:checked ~ #bar6,
  #checkbox:checked ~ #bar7,
  #checkbox:checked ~ #bar8 {
    transform: translateY(0);
  }

  #checkbox:checked ~ #bar1 { background-color: #ffadad; }
  #checkbox:checked ~ #bar2 { background-color: #ffd6a5; }
  #checkbox:checked ~ #bar3 { background-color: #fdffb6; }
  #checkbox:checked ~ #bar4 { background-color: #caffbf; }
  #checkbox:checked ~ #bar5 { background-color: #9bf6ff; }
  #checkbox:checked ~ #bar6 { background-color: #a0c4ff; }
  #checkbox:checked ~ #bar7 { background-color: #bdb2ff; }
  #checkbox:checked ~ #bar8 { background-color: #ffc6ff; }

  .nut {
    height: 0.15rem;
    aspect-ratio: 1/1;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    top: 0;
    transform: translateY(-3px);
    transform-origin: 50% 500%;
  }

  #nut1 { rotate: 45deg; }
  #nut2 { rotate: 90deg; }
  #nut3 { rotate: 135deg; }
  #nut4 { rotate: 180deg; }
  #nut5 { rotate: 225deg; }
  #nut6 { rotate: 270deg; }
  #nut7 { rotate: 315deg; }
  #nut8 { rotate: 360deg; }

  .cover {
    height: 2rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: #2a3439;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .checkboxLabel:has(:checked) {
    transform: rotate(-360deg);
  }

  .cover2 {
    height: 1.2rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: #91a3b0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    outline-width: 0.1rem;
    outline: solid;
    outline-color: #b2ffff;
  }

  .inCover2 {
    height: 100%;
    aspect-ratio: 1/1;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
  }

  .inCover2 .rainbow {
    height: 100%;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .rainbow div {
    flex: 1;
    width: 100%;
  }

  .rainbow div:nth-child(1) { background-color: #ffadad; }
  .rainbow div:nth-child(2) { background-color: #ffd6a5; }
  .rainbow div:nth-child(3) { background-color: #fdffb6; }
  .rainbow div:nth-child(4) { background-color: #caffbf; }
  .rainbow div:nth-child(5) { background-color: #9bf6ff; }
  .rainbow div:nth-child(6) { background-color: #a0c4ff; }
  .rainbow div:nth-child(7) { background-color: #bdb2ff; }

  .lock {
    position: absolute;
    height: 0.9rem;
    aspect-ratio: 1/1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 200ms ease-in;
    transition-delay: var(--total-duration);
  }

  #checkbox:checked ~ .lock {
    opacity: 1;
  }
`;


export default Checkbox;