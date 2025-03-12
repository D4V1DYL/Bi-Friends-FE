import React from 'react';
import './LoadingScreen.css';
import beeLogo from '../../assets/logo.png'
import { GradientBackground } from '../MaintainanceComponent/MaintananceScreen';


const LoadingScreen: React.FC = () => {
    return (
        <GradientBackground>
            <div className="loading-screen flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-col items-center">
                    <img src={beeLogo} alt="Friends" className="w-16 h-16" />
                    <svg width="250" height="50" className="mx-auto">
                        <path 
                            d="M 240 25 L 10 25"
                            stroke-miterlimit="10" 
                            fill="none" 
                            stroke="black"
                            stroke-width="5"
                            stroke-dasharray="10"
                            stroke-dashoffset="-100">
                            <animate
                                attributeName="stroke-dashoffset"
                                values="0;100"
                                dur="3s"
                                calcMode="linear"
                                repeatCount="indefinite" />
                        </path>
                    </svg>
                    <p className="text-center text-lg font-medium text-black">Page Loading...</p>
                </div>            
            </div>
        </GradientBackground>
    );
};

export default LoadingScreen;