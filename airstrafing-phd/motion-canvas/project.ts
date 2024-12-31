import {makeProject} from '@motion-canvas/core';

// CHAPTER 2: THE QUAKE SOURCE CODE
import ch2_intro from './scenes/ch2_intro?scene';
import ch2_vectornormalize from './scenes/ch2_vectornormalize?scene';
import ch2_tobefair from './scenes/ch2_tobefair?scene';
import ch2_actualeffect from './scenes/ch2_actualeffect?scene';
import ch2_alignment from './scenes/ch2_alignment?scene'
import ch2_thiswholeline from './scenes/ch2_thiswholeline?scene';
import ch2_fin from './scenes/ch2_finally?scene';

import a_ch2_intro from '../audio/02-01-intro.mp3'
import a_ch2_vectorNormalize from '../audio/02-02-vectornormalize.mp3'
import a_ch2_toBeFair from '../audio/02-05-tobefair.mp3'
import a_ch2_actualEffect from '../audio/02-03-actual-effect.mp3'
import a_ch2_alignment from '../audio/02-06-alignment.mp3'
import a_ch2_thisWholeLine from '../audio/02-07-thiswholeline.mp3'
import a_ch2_finally from '../audio/02-08-finally.mp3'

// CHAPTER 3: AIRSTRAFING
import ch3_ambiguousPurpose from './scenes/ch3_ambiguouspurpose?scene'
import ch3_susRename from './scenes/ch3_susrename?scene'
import ch3_runThroughFunc from './scenes/ch3_runthroughfunc?scene'
import ch3_guaranteedSpeedIncrease from './scenes/ch3_guaranteedSpeedIncrease?scene'
import ch3_preciseAndDifficult from './scenes/ch3_preciseAndDifficult?scene'
import ch3_wishvelTooFarForward from './scenes/ch3_wishvelTooFarForward?scene'
import ch3_watchValues from './scenes/ch3_watchvalues?scene'
import ch3_sizeOfVector from './scenes/ch3_sizeOfVector?scene'
import ch3_increaseStartingVelocity from './scenes/ch3_increaseStartingVelocity?scene'

import a_ch3_ambiguousPurpose from '../audio/03-01-ambiguouspurpose.mp3'
import a_ch3_susRename from '../audio/03-02-suspicious.mp3'
import a_ch3_runThroughFunc from '../audio/03-04-runthroughfunc.mp3'
import a_ch3_guaranteedSpeedIncrease from '../audio/03-05-guaranteedSpeedIncrease.mp3'
import a_ch3_preciseAndDifficult from '../audio/03-06-preciseAndDifficult.mp3'
import a_ch3_wishvelTooFarForward from '../audio/03-07-wishvelTooFarForward.mp3'
import a_ch3_watchValues from '../audio/03-08-watchValues.mp3'
import a_ch3_sizeOfVector from '../audio/03-09-sizeOfVector.mp3'
import a_ch3_increaseStartingVelocity from '../audio/03-10-increaseStartingVelocity.mp3'

// CHAPTER 4: BACK TO THE SOURCE ENGINE
import ch4_scalingDownVelocity from './scenes/ch4_scalingDownVelocity?scene'
import ch4_manipulateImpulse from './scenes/ch4_manipulateImpulse?scene'
import ch4_overallInputDirections from './scenes/ch4_overallInputDirections?scene'
import ch4_onceVelOver300 from './scenes/ch4_onceVelOver300?scene'
import ch4_onceAngleChanges from './scenes/ch4_onceAngleChanges?scene'
import ch4_ifWeThinkBack from './scenes/ch4_ifWeThinkBack?scene'

import a_ch4_scalingDownVelocity from '../audio/04-01-scalingDownVelocity.mp3'
import a_ch4_manipulateImpulse from '../audio/04-02-manipulateImpulse.mp3'
import a_ch4_overallInputDirections from '../audio/04-03-overallInputDirections.mp3'
import a_ch4_onceVelOver300 from '../audio/04-05-onceVelOver300.mp3'
import a_ch4_onceAngleChanges from '../audio/04-06-onceAngleChanges.mp3'
import a_ch4_ifWeThinkBack from '../audio/04-07-ifWeThinkBack.mp3'

// CHAPTER 5: QUAKE 2 AND BEYOND
import ch5_reducedAccelFactor from './scenes/ch5_reducedAccelFactor?scene'
import ch5_compareFunctions from './scenes/ch5_compareFunctions?scene'
import ch5_anotherLookAtDotProduct from './scenes/ch5_anotherLookAtDotProduct?scene'
import ch5_optimalInputAngle from './scenes/ch5_optimalInputAngle?scene'
import ch5_movingOptimalAngle from './scenes/ch5_movingOptimalAngle?scene'
import ch5_changeOneValue from './scenes/ch5_changeOneValue?scene'

import a_ch5_reducedAccelFactor from '../audio/05-01-reducedAccelFactor.mp3'
import a_ch5_compareFunctions from '../audio/05-02-compareFunctions.mp3'
import a_ch5_anotherLookAtDotProduct from '../audio/05-03-anotherLookAtDotProduct.mp3'
import a_ch5_optimalInputAngle from '../audio/05-04-optimalInputAngle.mp3'
import a_ch5_movingOptimalAngle from '../audio/05-05-movingOptimalAngle.mp3'
import a_ch5_changeOneValue from '../audio/05-06-changeOneValue.mp3'

// CHAPTER 6: DOOM
import ch6_subtractVector from './scenes/ch6_subtractVector?scene'
import ch6_soundsReasonable from './scenes/ch6_soundsReasonable?scene'
import ch6_personalGuess from './scenes/ch6_personalGuess?scene'
import ch6_changeInDirection from './scenes/ch6_changeInDirection?scene'

import a_ch6_subtractVector from './audio/06-01-subtractVector.mp3'
import a_ch6_soundsReasonable from '../audio/06-02-soundsReasonable.mp3'
import a_ch6_personalGuess from '../audio/06-03-personalGuess.mp3'
import a_ch6_changeInDirection from '../audio/06-04-changeInDirection.mp3'

// CHAPTER 8: COD
import a_ch8_sprintspeed from '../audio/08-01-sprintspeed.mp3'

import ch8_sprintspeed from './scenes/ch8_sprintspeed?scene'

// SIDENOTES
import sidenote_initialCalculation from './scenes/sidenote_initialCalculation?scene'

export default makeProject({
  scenes: [ch6_subtractVector],
  audio: a_ch8_sprintspeed,
});
