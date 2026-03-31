class Rectangle {
    constructor(xMin, xMax, yMin, yMax) {
        this.xMin = xMin; // Subject distance min
        this.xMax = xMax; // Subject distance max
        this.yMin = yMin; // Light distance min
        this.yMax = yMax; // Light distance max
    }

    get width() {
        return this.xMax - this.xMin;
    }

    get height() {
        return this.yMax - this.yMin;
    }
}

function cutRectangle(mainRect, cutRect) {
    const remainingPieces = [];

    // 1. Create the "Left" piece
    if (mainRect.xMin < cutRect.xMin) {
        remainingPieces.push(new Rectangle(mainRect.xMin, cutRect.xMin, mainRect.yMin, mainRect.yMax));
    }

    // 2. Create the "Right" piece
    if (mainRect.xMax > cutRect.xMax) {
        remainingPieces.push(new Rectangle(cutRect.xMax, mainRect.xMax, mainRect.yMin, mainRect.yMax));
    }

    // Create the "Top" piece
    if (mainRect.yMin < cutRect.yMin) {
        remainingPieces.push(new Rectangle(mainRect.xMin, mainRect.xMax, mainRect.yMin, cutRect.yMin));
    }

    // Create the "Bottom" piece
    if (mainRect.yMax > cutRect.yMax) {
        remainingPieces.push(new Rectangle(mainRect.xMin, mainRect.xMax, cutRect.yMax, mainRect.yMax));
    }

    return remainingPieces;
}


function getIntersection(rectA, rectB) {
    const xMin = Math.max(rectA.xMin, rectB.xMin);
    const xMax = Math.min(rectA.xMax, rectB.xMax);
    const yMin = Math.max(rectA.yMin, rectB.yMin);
    const yMax = Math.min(rectA.yMax, rectB.yMax);

    // A valid rectangle must have positive width and height
    if (xMin < xMax && yMin < yMax) {
        return new Rectangle(xMin, xMax, yMin, yMax);
    } else {
        // No intersection
        return null;
    }
}



function suffice(target, cameraList) {
    // If the target rectangle has an area of 0, it means it has been
    // completely cut away" by previous cameras. This is a success case.
    if (target.width <= 0 || target.height <= 0) {
        return true;
    }

    // If we have no more hardware cameras to check, but we still have a
    // target rectangle with area > 0, we have found a gap. Failure case.
    if (cameraList.length === 0) {
        return false;
    }

    // Get the first camera (C1) and the rest of the list (C2...Cn)
    const [firstCamera, ...remainingCameras] = cameraList;

    // Calculate the intersection (overlap) between the Target and C1.
    const intersection = getIntersection(target, firstCamera);

    if (!intersection) {
        // If there is no intersection, C1 does not cover any part of the Target.
        // We can ignore C1 and check the remaining cameras.
        return suffice(target, remainingCameras);
    } else {
        // Cut the Target rectangle by removing the area covered by C1, resulting in 0 to 4 new rectangles (uncovered pieces).
        const uncoveredPieces = cutRectangle(target, intersection);

        // Recursively check if the remaining cameras can cover all the uncovered pieces.
        return uncoveredPieces.every((piece) => suffice(piece, remainingCameras));
    }
}


const targetGoal = new Rectangle(1, 10, 1, 10);

// Hardware Camera with its characteristics defined as rectangles (subject distance(x1, x2) and light distance(y1, y2))
const hardwareCameras = [
    new Rectangle(1, 6, 1, 6),
    new Rectangle(1, 9, 1, 10),
    new Rectangle(9, 10, 1, 9)
];

const isSufficient = suffice(targetGoal, hardwareCameras);

console.log(`Do the hardware cameras suffice? : ${isSufficient}`);