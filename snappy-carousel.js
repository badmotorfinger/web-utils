(function () {
    'use strict';
    var slides = document.querySelectorAll('.my-slider img'),
        imgCont = document.querySelector('.my-slider'),
        imageContainerX = imgCont.getBoundingClientRect().x,
        lastScrollDirection = slides[0].getBoundingClientRect(),
        timer,
        goingRight = true;

    imgCont.addEventListener('touchend', function (e) {
        clearTimeout(timer);
        timer = setTimeout(refresh(e), 500);
    }, false);

    var refresh = function (e) {

        return function () {

            var imageClosestToContainer;

            if (goingRight) {

                imageClosestToContainer = Array.from(slides).find(function (slide) { return slide.getBoundingClientRect().x > imageContainerX });

                if (imageClosestToContainer) {

                    var toScroll = (imageClosestToContainer.getBoundingClientRect().x - imageContainerX) - 1;

                    imgCont.scrollBy({ top: 0, left: toScroll, behavior: 'smooth' });
                }
            } else {

                imageClosestToContainer = Array.from(slides).reverse().find(function (x) { return x.getBoundingClientRect().x < imageContainerX; });

                if (imageClosestToContainer) {

                    var toScrollL = imageClosestToContainer.getBoundingClientRect().x - imageContainerX + 1;

                    imgCont.scrollBy({ top: 0, left: toScrollL, behavior: 'smooth' });
                }
            }
        };
    };

    setInterval(function () {
        var currentDirection = slides[0].getBoundingClientRect();

        if (currentDirection.x === lastScrollDirection.x) {
            return;
        }

        if (lastScrollDirection.x < currentDirection.x) {
            goingRight = false;
        } else {
            goingRight = true;
        }
        lastScrollDirection = currentDirection;
    }, 100);
})();
