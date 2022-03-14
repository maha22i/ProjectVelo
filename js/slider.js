class Slider
{
  /**
   * @param {Number} timer Duration of the timer in milliseconds
   * @method popup Plauys animation when info button is clicked
   * @method autoplay Plays slider automatically 
   * @method controls Adds controls options to the slider : pause, previous and next
   */

  constructor(timer)
  {
    this.timer = timer;

    this.popup();
    this.autoplay();
    this.controls();

    this.itemCount = document.querySelectorAll('.carousel li.items').length;
  }

  popup()
  {
    $('.button').click(() =>
    {
      let buttonId = $('.button').attr('id');
      $('#popup-container').removeAttr('class').addClass(buttonId);
      $('body').addClass('popup-active');
    })
    
    $('#popup-container').click(() =>
    {
      $('#popup-container').addClass('out');
      $('body').removeClass('popup-active');
    })
  }

  autoplay()
  {
    this.autoSwap = setInterval(() => this.swap(''), this.timer)
    $('.pause').removeClass("paused");
  }

  // Slider controls events : pause, previous and forward
  controls()
  {
    $('#pause').click(() => this.pause());
    $('#previous').click(() => this.previous());
    $('#next').click(() => this.next());
    // Evenement global
    document.addEventListener('keydown', (e) => this.keydown(e))
  }

  pause()
  {
    $('.pause').toggleClass('pulse');
    setTimeout(()=> $('.pause').removeClass('pulse'), 100)

    $('.main-pos').addClass("pauseImg");
    $('.pause').toggleClass("paused");
    if (document.getElementsByClassName('paused').length == 0)
    {
      $('.main-pos').removeClass("pauseImg");
      clearInterval(this.autoSwap);
      this.autoplay();
    }
    else
    {
      clearInterval(this.autoSwap);
    }
  }

  previous()
  {
    $('.previous').toggleClass('pulse');
    setTimeout(()=> $('.previous').removeClass('pulse'), 100)

    $('.main-pos').removeClass("pauseImg");
    $('.pause').removeClass("paused");

    this.swap('counter-clockwise');
    clearInterval(this.autoSwap);
    this.autoSwap = setInterval(() => this.swap(''), this.timer)
  }

  next()
  {
    $('.next').toggleClass('pulse');
    setTimeout(()=> $('.next').removeClass('pulse'), 100)

    $('.main-pos').removeClass("pauseImg");
    $('.pause').removeClass("paused");

    this.swap('clockwise');
    clearInterval(this.autoSwap);
    this.autoSwap = setInterval(() => this.swap(''), this.timer)
  }

  keydown(e)
  {
    // ajouter évènement ici
    switch(e.which) 
    {
      case 37: // left
        this.previous();
        break;
      case 39: // right
        this.next()
        break;
      case 32: // spacebar
        this.pause()
        break;
      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }

  swap(direction) 
  { 
    if (direction == 'counter-clockwise') 
    {
      // Defines pivot element
      let leftposition = $('.left-pos').attr('id') - 1;
      if (leftposition == 0)
      {
        leftposition = this.itemCount;
      }
      $('.hide-pos').removeClass('hide-pos').addClass('right-pos');
      $('.right-pos').removeClass('right-pos').addClass('back-pos');
      $('.main-pos').removeClass('main-pos').addClass('right-pos');
      $('.left-pos').removeClass('left-pos').addClass('main-pos');
      $('#'+ leftposition + '').removeClass('back-pos').addClass('left-pos');
    }

    if (direction == 'clockwise' || direction == '' || direction == null ) 
    {       
      let rightitem = $('.right-pos').attr('id');
      let leftitem = $('.left-pos').attr('id');
      let frontitem = $('.main-pos').attr('id');
      let backitem = $('.back-pos').attr('id');
      let hideitem = $('.hide-pos').attr('id');
      $('#'+frontitem+'').removeClass('main-pos').addClass('left-pos');        
      $('#'+leftitem+'').removeClass('left-pos').addClass('hide-pos');
      $('#'+hideitem+'').removeClass('hide-pos').addClass('back-pos');
      $('#'+backitem+'').removeClass('back-pos').addClass('right-pos'); 
      $('#'+rightitem+'').removeClass('right-pos').addClass('main-pos');
    }
  }
}