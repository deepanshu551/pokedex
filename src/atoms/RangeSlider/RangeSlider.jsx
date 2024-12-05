import React, { useState, useEffect } from "react";
import "./RangeSlider.scss";

const RangeSlider = ({ sliderId, defaultValues, onRangeChange }) => {
  const [sliderOneValue, setSliderOneValue] = useState(defaultValues?defaultValues.min:70);
  const [sliderTwoValue, setSliderTwoValue] = useState(defaultValues?defaultValues.max:150);
  const minGap = 0;
  const maxValue = 210;

  const fillColor = () => {
    const percent1 = (sliderOneValue / maxValue) * 100;
    const percent2 = (sliderTwoValue / maxValue) * 100;
    const track = document.querySelector(`.slider-track-${sliderId}`);
    if (track) {
      track.style.background = `linear-gradient(to right, #93B2B2 ${percent1}%, #2E3156 ${percent1}%, #2E3156 ${percent2}%, #93B2B2 ${percent2}%)`;
    }
  };

  const handleSlideOne = (e) => {
    const value = parseInt(e.target.value);
    if (sliderTwoValue - value <= minGap) {
      setSliderOneValue(sliderTwoValue - minGap);
    } else {
      setSliderOneValue(value);
    }
  };

  const handleSlideTwo = (e) => {
    const value = parseInt(e.target.value);
    if (value - sliderOneValue <= minGap) {
      setSliderTwoValue(sliderOneValue + minGap);
    } else {
      setSliderTwoValue(value);
    }
  };

  useEffect(() => {
    setSliderOneValue(defaultValues ? defaultValues.min : 70);
    setSliderTwoValue(defaultValues ? defaultValues.max : 150);
  }, [defaultValues]);

  useEffect(() => {
    fillColor();
    onRangeChange({ min: sliderOneValue, max: sliderTwoValue });
  }, [sliderOneValue, sliderTwoValue]);

  useEffect(() => {
    const slider1 = document.getElementById(`slider-1-${sliderId}`);
    const tooltip1 = document.getElementById(`slider-tooltip-1-${sliderId}`);
    const slider2 = document.getElementById(`slider-2-${sliderId}`);
    const tooltip2 = document.getElementById(`slider-tooltip-2-${sliderId}`);
    
    function addValue(slider,tooltip){
        const value = slider.value;
        tooltip.textContent = value;
  
        // Dynamically position tooltip above the thumb
        let thumbWidth;
        if(window.outerWidth>720){
          thumbWidth = 41; // Approximate width of the thumb

        }
        else{
          thumbWidth = 20;
        }
        const sliderWidth = slider.offsetWidth;
        const position =
          ((value - slider.min) / (slider.max - slider.min)) *
          (sliderWidth - thumbWidth);
  
        tooltip.style.left = `${position-10 + thumbWidth / 2}px`;
    }
    addValue(slider1,tooltip1);
    addValue(slider2,tooltip2);
    
    


    slider1.addEventListener("input", () => {
      addValue(slider1,tooltip1);
    });

    slider2.addEventListener("input", () => {
      addValue(slider2,tooltip2);
    });
  }, [sliderId,sliderOneValue, sliderTwoValue]);

  return (
    <div className="wrapper">
      <span className="slider-label slider-label-left">0</span>
      <span className="slider-label slider-label-right">210</span>

      <div className="container">
        <div className={`slider-track slider-track-${sliderId}`}></div>
        <div>
          <div className={`tooltip`} id={`slider-tooltip-1-${sliderId}`}></div>
          <input
            type="range"
            min="0"
            max="210"
            value={sliderOneValue}
            id={`slider-1-${sliderId}`}
            onChange={handleSlideOne}
          />
        </div>

        <div>
          <div className={`tooltip`} id={`slider-tooltip-2-${sliderId}`}></div>
          <input
            type="range"
            min="0"
            max="210"
            value={sliderTwoValue}
            id={`slider-2-${sliderId}`}
            onChange={handleSlideTwo}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
