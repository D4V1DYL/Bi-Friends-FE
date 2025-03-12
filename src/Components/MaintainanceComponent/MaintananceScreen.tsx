import { CSSProperties } from 'react';
import Picture from '../../assets/Friends.png';
import logo from '../../assets/logo.png';

import { ReactNode } from 'react';

const GradientBackground = ({ children }: { children: ReactNode }) => {
  const gradientStyle: CSSProperties = {
    background: "linear-gradient(43deg, #B1F0F7, #6CA7C1)",
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return <div style={gradientStyle}>{children}</div>;
};

function MaintainanceScreen() {
  return (
    <GradientBackground>

      {/* <div className="flex flex-col items-center justify-center text-center p-8 text-white w-full h-full"> */}
        {/* <div className="flex flex-col items-center space-y-4 w-3/4 max-w-xl p-6 bg-opacity-50 rounded-lg">
          <h2 className="text-5xl font-bold text-black">Our site is currently down for maintenance</h2>
          <p className="text-sm max-w-lg text-black font-semibold">
            We apologize for any inconveniences caused and we will be online as soon as possible.
            Please check again in a little while. Thank you!
          </p>
          <p className="text-sm max-w-lg text-black font-semibold flex items-center justify-center">
            <img src={logo} alt="Friends" className="w-1/20 mr-2" /> BiFriends
          </p>
          <img 
            src={Picture} 
            alt="Friends" 
            className="w-7/8 max-w-[600px] h-auto object-cover absolute bottom-0 left-1/2 -translate-x-1/2"
          />
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-start text-center p-8 text-white w-full h-full">
        <div className="flex flex-col items-center space-y-4 w-3/4 max-w-xl p-6 bg-opacity-50 rounded-lg mt-16">
          <h2 className="text-5xl font-bold text-black">Our site is currently down for maintenance</h2>
          <p className="text-sm max-w-lg text-black font-semibold">
            We apologize for any inconveniences caused and we will be online as soon as possible.
            Please check again in a little while. Thank you!
          </p>
          <p className="text-sm max-w-lg text-black font-semibold flex items-center justify-center">
            <img src={logo} alt="Friends" className="w-1/20 mr-2" /> BiFriends
          </p>
          {/* <img src={Picture} alt="Friends" className="w-1/1" /> */}
          <img 
            src={Picture} 
            alt="Friends" 
            className="w-full max-w-[800px] h-auto object-cover absolute bottom-0 left-1/2 -translate-x-1/2"
          />
        </div>
      </div>


    </GradientBackground>
  );
}

export default MaintainanceScreen;