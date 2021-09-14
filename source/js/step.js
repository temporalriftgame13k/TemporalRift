var viewScreenEl = getElsBySelector('.m')[0];

/**
 * Plays timelines for current step.
 * @param {number} stepIndex
 */
function showStep(stepIndex) {
  switch(stepIndex) {
    case 0:
      executeTimeline([
        1,
        () => {
          showSprites([spriteSky, spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spritePlanet1, spriteShip]);
          showEl(viewScreenEl);
          setSpaceSpritePositions();
          tweenToVariant(2, spriteGeorgia, 0);
        },
        2.5,
        () => {
          showPortrait(0, 2, spriteGeorgia);
        },
        2.5,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 7:
      showDialog(stepIndex, () => {setOptions(['REFUEL', '', "DON'T REFUEL"], 0);});

      break;
    case 9:
      executeTimeline([
        () => {
          showDialog(stepIndex);
          hideSprites([spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spriteShip]);
        },
        1,
        () => {
          showAsteroidPuzzle();
        }
      ]);

      break;
    case 10:
      executeTimeline([
        () => {
          hideDialog();
        },
        1,
        () => {
          showSprites([spriteSky, spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spritePlanet1, spriteShip]);
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 11:
      executeTimeline([
        () => {
          hideDialog();
        },
        2,
        () => {
          hideEl(viewScreenEl);
        },
        1,
        () => {
          hideViewScreenSprites();
          removeAllTickers();
        },
        .5,
        () => {
          showSprites([spriteSky, spriteStation, spriteWave, spriteWave_1]);
          createTicker((complete, duration) => {
            moveSprite(spriteWave, Math.sin(interpolate(complete, duration, 0, 6.28)) * 20 - 25, 79);
            moveSprite(spriteWave_1, Math.cos(interpolate(complete, duration, 0, 6.28)) * 20 - 25, 89);
          }, 8, true);
          showEl(viewScreenEl);
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 22:
      executeTimeline([
        () => {
          showDialog(stepIndex);
          hideSprites([spriteStation, spriteWave, spriteWave_1]);
        },
        1,
        () => {
          showPipePuzzle();
        }
      ]);

      break;
    case 23:
      executeTimeline([
        () => {
          hideDialog();
        },
        1,
        () => {
          showSprites([spriteStation, spriteWave, spriteWave_1]);
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 32:
      executeTimeline([
        () => {
          hideSprites([spriteStation, spriteWave, spriteWave_1]);
        },
        1,
        () => {
          showSprites(spriteCells);
          showDialog(stepIndex, () => {setOptions(['Three', '', 'Four'], 0);});
        }
      ]);

      break;
    case 33:
      executeTimeline([
        () => {
          hideDialog();
          hideSprites(spriteCells);
        },
        1,
        () => {
          showSprites([spriteStation, spriteWave, spriteWave_1]);
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 36:
      executeTimeline([
        () => {
          hideDialog();
        },
        2,
        () => {
          hideEl(viewScreenEl);
        },
        1,
        () => {
          hideViewScreenSprites();
          removeAllTickers();
        },
        .5,
        () => {
          showSprites([spriteSky, spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spritePlanet1, spriteShip, spriteOptions]);
          showEl(viewScreenEl);
          setSpaceSpritePositions();
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 37:
      executeTimeline([
        () => {
          showDialog(stepIndex);
          hideSprites([spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spriteShip]);
        },
        1,
        () => {
          showMapPuzzle();
        }
      ]);

      break;
    case 38:
      executeTimeline([
        () => {
          hideDialog();
        },
        1,
        () => {
          showSprites([spriteSky, spriteStars, spriteStars_1, spriteCluster, spriteCluster_1, spriteNebula, spritePlanet1, spriteShip]);
        },
        1,
        () => {
          showDialog(stepIndex, showContinue);
        }
      ]);

      break;
    case 46:
      showDialog(stepIndex, () => {setOptions(['WATER', 'A SHADOW', 'LOSS'], 2);});
      break;

    case 57:
      showDialog(stepIndex, () => {setOptions(['ENTER RIFT', '', "DO NOT ENTER"]);});
      break;

    case 61:
      showDialog(stepIndex, () => {});

      break;
    default:
      showDialog(stepIndex, showContinue);
  }
}

/**
 * Position and start space sprites and animations.
 */
function setSpaceSpritePositions() {
  moveSprite(spritePlanet1, 39, -40);
  moveSprite(spriteShip, 47, 75);

  createTicker((complete, duration) => {
    moveSprite(spriteNebula, 0, interpolate(complete, duration, -90, 190, 1));
    moveSprite(spriteStars, 0, interpolate(complete, duration, -100, 100, 1));
    moveSprite(spriteStars_1, 2, interpolate(complete + duration * .5, duration, -100, 100, 1));
    moveSprite(spriteCluster, 15, interpolate(complete + duration * .2, duration, -20, 120, 1));
    moveSprite(spriteCluster_1, 65, interpolate(complete + duration * .8, duration, -20, 120, 1));
  }, 10, true);
}
