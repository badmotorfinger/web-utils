// https://stackoverflow.com/questions/29999515/get-final-size-of-background-image
function getBackgroundSize(elem) {
    // This:
    //       * Gets elem computed styles:
    //             - CSS background-size
    //             - element's width and height
    //       * Extracts background URL
    var computedStyle = window.getComputedStyle(elem),
        image = new Image(),
        src = computedStyle.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
        cssSize = computedStyle.backgroundSize,
        elemW = parseInt(computedStyle.width.replace('px', ''), 10),
        elemH = parseInt(computedStyle.height.replace('px', ''), 10),
        elemDim = [elemW, elemH],
        computedDim = [],
        ratio;
    // Load the image with the extracted URL.
    // Should be in cache already.
    image.src = src;
    // Determine the 'ratio'
    ratio = image.width > image.height ? image.width / image.height : image.height / image.width;
    // Split background-size properties into array
    cssSize = cssSize.split(' ');
    // First property is width. It is always set to something.
    computedDim[0] = cssSize[0];
    // If height not set, set it to auto
    computedDim[1] = cssSize.length > 1 ? cssSize[1] : 'auto';
    if (cssSize[0] === 'cover') {
        // Width is greater than height
        if (elemDim[0] > elemDim[1]) {
            // Elem's ratio greater than or equal to img ratio
            if (elemDim[0] / elemDim[1] >= ratio) {
                computedDim[0] = elemDim[0];
                computedDim[1] = 'auto';
            } else {
                computedDim[0] = 'auto';
                computedDim[1] = elemDim[1];
            }
        } else {
            computedDim[0] = 'auto';
            computedDim[1] = elemDim[1];
        }
    } else if (cssSize[0] === 'contain') {
        // Width is less than height
        if (elemDim[0] < elemDim[1]) {
            computedDim[0] = elemDim[0];
            computedDim[1] = 'auto';
        } else {
            // elem's ratio is greater than or equal to img ratio
            if (elemDim[0] / elemDim[1] >= ratio) {
                computedDim[0] = 'auto';
                computedDim[1] = elemDim[1];
            } else {
                computedDim[1] = 'auto';
                computedDim[0] = elemDim[0];
            }
        }
    } else {
        // If not 'cover' or 'contain', loop through the values
        for (var i = cssSize.length; i--;) {
            // Check if values are in pixels or in percentage
            if (cssSize[i].indexOf('px') > -1) {
                // If in pixels, just remove the 'px' to get the value
                computedDim[i] = cssSize[i].replace('px', '');
            } else if (cssSize[i].indexOf('%') > -1) {
                // If percentage, get percentage of elem's dimension
                // and assign it to the computed dimension
                computedDim[i] = elemDim[i] * (cssSize[i].replace('%', '') / 100);
            }
        }
    }
    // If both values are set to auto, return image's
    // original width and height
    if (computedDim[0] === 'auto' && computedDim[1] === 'auto') {
        computedDim[0] = image.width;
        computedDim[1] = image.height;
    } else {
        // Depending on whether width or height is auto,
        // calculate the value in pixels of auto.
        // ratio in here is just getting proportions.
        ratio = computedDim[0] === 'auto' ? image.height / computedDim[1] : image.width / computedDim[0];
        computedDim[0] = computedDim[0] === 'auto' ? image.width / ratio : computedDim[0];
        computedDim[1] = computedDim[1] === 'auto' ? image.height / ratio : computedDim[1];
    }
    // Finally, return an object with the width and height of the
    // background image.
    return {
        width: computedDim[0],
        height: computedDim[1]
    };
}
