'use strict';

let trackMap = {
  'PuzzlePieces' : 0,
  'FlyAway' : 1,
  'Dawn' : 2,
  'Daylight' : 3,
  'WolvesRemix' : 4,
  'Memento' : 5,
  'FetishRemix' : 6,
  'DMs' : 7,
  'LastChance' : 8,
  'FeelingThisIntro' : 9,
  'MyOwnWorstEnemyRemix' : 10,
  'HeavyRemix' : 11,
  'Dungeon' : 12,
  'CompetitionMix' : 13,
  'BoysofSummerRemix2' : 14,
  'PumpkinSpiceMix' : 15,
  'ChillaxMix' : 16,
  'ClocksRemix' : 17,
  'TheSun' : 18,
  'HandsOfFools' : 19,
  'Damaging' : 20,
  'LostAtSea' : 21,
  'SheWasMine' : 22,
  'SweatherWeather' : 23
};
let source = '';
let updateSlider = false;
let sliderRadius = 75;

// Resize the radius of slider for smaller screens
$(window).on('resize', function() {
  if($(window).width() <= 768)
    sliderRadius = 95;
  else
    sliderRadius = 75;
  $('.circleSlider').roundSlider('option', 'radius', sliderRadius);
});

$(document).ready(function(e) {

  var widget = SC.Widget('sc-player');
  widget.bind(SC.Widget.Events.READY, function() {

    if($(window).width() <= 768) {
      sliderRadius = 95;
    }
    // Create each circle slider
    $(".circleSlider").roundSlider({
      sliderType: "min-range",
      handleShape: "round",
      width: 15,
      radius: sliderRadius,
      value: 0,
      showTooltip: false,
      svgMode: true,
      borderWidth: 0,
      pathColor: 'rgba(0, 0, 0, 0.5)',
      rangeColor: 'rgba(255, 255, 255, 0.3)',
      min: 0,
      step: 0.1
    });
    // Fixes issue with circle slider when scaling the song box on hover
    $(".songBox").hover(
      function(event) {
        let playButton = $(this).find(".playButton");
        playButton.css("opacity", "1");
        $(this).css("transform", "scale(1.1)");
        playButton.css("transform", "scale(0.9)");

    }, function(event) {
      $(this).css("transform", "scale(1)");
      let playButton = $(this).find(".playButton");
      playButton.css("opacity", "0");
      playButton.css("transform", "scale(1)");
    });

    // On change of slider (click somewhere else on the slider) seek sound to the position
    $(".circleSlider").on("change", function(e) {
      let icon = $(this).siblings('.playIcon');
      widget.getCurrentSoundIndex(function(index) {
        if(index === trackMap[icon[0].id]) {
          widget.seekTo(e.value * 1000);
        }
      });
    });

    // On start drag, if current sound is playing then don't update the slider on PLAY_PROGRESS
    $(".circleSlider").on("start", function(e) {
      let icon = $(this).siblings('.playIcon');
      widget.isPaused(function(paused) {
        widget.getCurrentSoundIndex(function(index) {
          if(!paused && index === trackMap[icon[0].id])
          {
            updateSlider = false;
          }
        });
      });
    });

    // On stop drag, seek sound to the value of the slider and resume updating the slider on PLAY_PROGRESS
    $(".circleSlider").on("stop", function(e) {
      let circleSlider = $(this);
      let icon = $(this).siblings('.playIcon');
      widget.seekTo(e.value * 1000);
      widget.isPaused(function(paused) {
        widget.getCurrentSoundIndex(function(index) {
          if(!paused && index === trackMap[icon[0].id])
          {
            updateSlider = true;
          }
        });
      });
    });

    // On play, change the icon from play to pause and change all others to play icon
    $('.playIcon').click(function(event) {
      let icon = $(this);
      $('.playIcon').not(this).each(function() {
        $(this).removeClass('fa-pause');
        $(this).addClass('fa-play');
      });
      $(this).toggleClass('fa-play fa-pause');

      // If current sound is playing, pause it
      widget.isPaused(function(paused) {
        let newOrPaused = paused;
        widget.getCurrentSoundIndex(function(index) {
          newOrPaused = newOrPaused || index !== trackMap[icon[0].id];
          if(!newOrPaused) {
            updateSlider = false;
            widget.pause();
          }
          // If paused or starting a new track, seek sound to the position of the slider and play. Update value of slider when PLAY_PROGRESS event occurs
          else {
            updateSlider = false;
            widget.pause();
            widget.skip(trackMap[icon[0].id]);
            source = icon[0].id;
            let playbackPosition = $(icon.siblings('.circleSlider')[0]).roundSlider('option', 'value') * 1000;
            widget.seekTo(playbackPosition);
            updateSlider = true;
            widget.unbind(SC.Widget.Events.PLAY);
            widget.bind(SC.Widget.Events.PLAY, function() {
              widget.getDuration(function(duration) {
                $(icon.siblings('.circleSlider')[0]).roundSlider('option', 'max', duration / 1000);
              });
            });
            widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
            widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(progress) {
              if(updateSlider) {
                $(icon.siblings('.circleSlider')[0]).roundSlider('option', 'value', progress.currentPosition / 1000);
              }
            });
            widget.play();
            // Set icon to loading until sound fully loads?
          }
        });
      });
    });
  });

  // When sound finishes playing
  widget.bind(SC.Widget.Events.FINISH, function() {
    let icon = $("#" + source);
    icon.toggleClass('fa-play fa-pause');
    widget.pause();
  });
});
