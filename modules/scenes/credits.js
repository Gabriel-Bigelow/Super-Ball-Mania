import { c, centerX, centerY, changeScene, height, resScale, width } from "../../Main.js";
import { buttonMusicCredits, buttonPreviousScreen, buttonSoundCredits, buttonSpriteCredits, buttonTextureCredits } from "../buttons.js";
import { wrapWrite } from "../drawShapes.js";
import { renderBackground } from "./background/background.js";
import { sceneTitle } from "./titleScreen.js";


let credMus0 = "Carnival Fun - by hooksounds.com";
let credMus1 = "An Old Photo - by Enzo Orefice";
let credMus2 = "Gypsy Guitar Happy Cooking - by MEDIA MUSIC GROUP";
let credMus3 = "Vintage Jazz Big Band Swing - by Volodymyr Piddubnyk";
let credMus4 = "Moon Boots - by Amber Waldron";
let credMus5 = "Le Grand Chase - by Kevin MacLeod";
let credMus6 = "Nauticalities - by Keith Papworth";
let credMus7 = "Elevator Music - by Lesfm";
let credMus8 = "Ohayashi - by PeriTune"
let credMus9 = "Nerdy and Quirky - by Musictown";

let credSnd0 = "Hitting Wood - by altfuture on pixabay.com";
let credSnd1 = "Household Metal Tin Cup Set down - by storyblocks.com";
let credSnd2 = "Golf Club Swing Impact Ball - by storyblocks.com";
let credSnd3 = "Videogame Cartoon Slide Up - by storyblocks.com";
let credSnd4 = "splat - by zolopher on freesound.org";
let credSnd5 = "Newspaper Squish Bug Splat - by storyblocks.com";
let credSnd6 = "Swing Stick - by crawfordjohnb@bellsouth.net";
let credSnd7 = "Punch Sound Effects - by RuskiCommunist on pixabay.com";
let credSnd8 = "HQ Explosion - by Quaker540 on freesound.org";
let credSnd9 = "Grilled bacon - by danieldouch on pixabay.com";
let credSnd10 = "Wrong Buzzer - by KevinVG207 on pixabay.com";
let credSnd11 = "stop - by irinairinafomicheva on pixabay.com";
let credSnd12 = "police - by guitarguy1985 on pixabay.com";
let credSnd13 = "Herring Gull 1 - by Canardo55 on pixabay.com";
let credSnd14 = "Object Sand Spray - by storyblocks.com";
let credSnd15 = "Crash Wood - by storyblocks.com";
let credSnd16 = "Water Splash - by speedygonzo on pixabay.com";
let credSnd17 = "MechanicalClamp - by Skullmasha on pixabay.com";
let credSnd18 = "negative beeps - by themusicalnomad on pixabay.com";
let credSnd19 = "Collect - by Wagna on pixabay.com";
let credSnd20 = "All 'Simon says' voicelines generated by readloud.net (Eric - Male voice)";
let credSnd21 = "Strong Wind Blowing Sound - by SoundEffectsFactory";
let credSnd22 = "FX swanee whistle up - by v0lidation on pixabay.com";
let credSnd23 = "Positive Interface Sound - by storyblocks.com"



let creditsSprite0 = "Confetti Effect Spritesheet - by jellyfizh on opengameart.org";
let creditsSprite1 = "Smoke Aura - by Beast on opengameart.org";
let creditsSprite2 = "Spark Effect - by kurohina on opengameart.org";
let creditsSprite3 = '"Fuck Yeah Pixels - Mario 8bit Warp Pipe Png" - on clipartmax.com';
let creditsSprite4 = "Xbox 360 Buttons - by Mr. C on spriters-resource.com";
let creditsSprite5 = "Eagle Atlas - Top Down Bird Sprite by nicepng.com";
let creditsSprite6 = "Unity Sprite Sheet Explosion, Chandelier, Lamp, Crystal HD PNG Download - by flyclipart.com"

let credTex0 = "Sea Water - by the3rdSequence";
let credTex1 = "Lava Magma Seamless Texture - by textures4photoshop.com";
let credTex2 = "Glass seamless texture - by jojotextures";
let credTex3 = "even grey pavement texture 0099 - by Texturelib.com";
let credTex4 = "Dark red brick wall - by tilingtextures.com";
let credTex5 = "Seamless Concrete Texture + (Maps) by - Seme Design Lab on texturise.club";



let musicCredits = [credMus0, credMus1, credMus2, credMus3, credMus4, credMus5, credMus6, credMus7, credMus8, credMus9];
let soundCredits = [credSnd0, credSnd1, credSnd2, credSnd3, credSnd4, credSnd5, credSnd6, credSnd7, credSnd8, credSnd9, credSnd10, credSnd11, credSnd12, credSnd13, credSnd14, credSnd15, credSnd16, credSnd17, credSnd18, credSnd19, credSnd20, credSnd21, credSnd22, credSnd23];
let spriteCredits = [creditsSprite0, creditsSprite1, creditsSprite2, creditsSprite3, creditsSprite4, creditsSprite5, creditsSprite6];
let textureCredits = [credTex0, credTex1, credTex2, credTex3, credTex4, credTex5];

let displayedCredits;

export function sceneCredits () {
    renderBackground();
    
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = `${20*resScale()}px oswald`;
    c.textAlign = 'center';

    if (displayedCredits) {
        for (let i = 0; i < displayedCredits.length; i++) {
            c.fillText(displayedCredits[i], centerX, height*0.2 + 30*resScale()*i);
        }
    }


    buttonMusicCredits.draw(displayWhichCredits, musicCredits);
    buttonSoundCredits.draw(displayWhichCredits, soundCredits);
    buttonSpriteCredits.draw(displayWhichCredits, spriteCredits);
    buttonTextureCredits.draw(displayWhichCredits, textureCredits);
    buttonPreviousScreen.draw(changeScene, sceneTitle);
}

function displayWhichCredits (whichCredits) {
    if (displayedCredits !== whichCredits) {
            displayedCredits = whichCredits;
    } else {
        displayedCredits = undefined;
    }
}