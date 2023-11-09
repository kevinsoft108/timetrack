import * as faceapi from 'face-api.js';

var netInitialized = false
var faceMatcher = null
var referenceImg = new Image();
let descriptors = { reference: null, query: null }

// @desc    Initialize faceapi net. By default we use SSdMobileNet
export const initializeNet = async () => {
    try {
        if (netInitialized) return
        console.log("--------------------------------------initializing Net----------------------------------------")
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/weights')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/weights')
        netInitialized = true

    } catch (error) {
        console.log(error.message)
    }
}

//@desc     Crop detected face region
export const cropFaceRegion = async (buffer) => {
    try {
        //console.log("--------------------------------------Crop Face Region----------------------------------------")
        var img = new Image();
        img.src = buffer

        //console.log(buffer)

        //Detect the face with the highest confidence score in an image.
        const detection = await faceapi.detectSingleFace(img)

        if (detection) {
            //console.log(detection)
            // A face was detected
            const bbox = detection.box; // Access the bounding box directly using the `box` property
            //console.log(bbox);

            const faceRect = [
                new faceapi.Rect(parseInt(bbox._x), parseInt(bbox._y), parseInt(bbox._width), parseInt(bbox._height))
            ]

            // const faceRect = [
            //     new faceapi.Rect(0.1, 0.1, 0.8, 0.8)
            // ]

            // console.log(faceRect)

            // console.log("source width ", img.width.toString())
            // console.log("source height ", img.height.toString())

            // crop face region from input image
            const canvas = await faceapi.extractFaces(img, faceRect)
            const faceBuffer = canvas[0].toDataURL('image/jpeg')

            // console.log(faceBuffer, "----------face region")


            // to test whether cropped image is valid or not
            // const faceImg = new Image();
            // faceImg.src = faceBuffer
            // console.log("face image width ", faceImg.width.toString())
            // console.log("face image height ", faceImg.height.toString())

            return faceBuffer
        } else {
            // No face was detected
            // console.log("No face detected");
            return ""
        }

    } catch (error) {
        console.log(error.message)
    }
}


// @desc    Initialize FaceMatcher for detection and recognition
const initializeFaceMatcher = async (referenceBuffer) => {
    try {
        console.log("--------------------------------------initializing FaceMatcher----------------------------------------")

        referenceImg.src = referenceBuffer;

        const referenceResult = await faceapi
            .detectAllFaces(referenceImg)
            .withFaceLandmarks()
            .withFaceDescriptors()

        if (!referenceResult.length) {
            console.log("no person detected in reference image")
            return null
        }

        return new faceapi.FaceMatcher(referenceResult)

    } catch (error) {
        console.log(error.message);
    }
}

// @desc    compare two faces and check if they are same or not
export const getSimilarityBetweenFaces = async (referenceBuffer, queryBuffer) => {
    try {
        if (referenceBuffer == "") {
            console.log('reference image undefined')
            return 1;
        }
        if (queryBuffer == "") {
            console.log('query image undefined')
            return 1;
        }

        if (!netInitialized) {
            await initializeNet();
        }


        // console.log(referenceBuffer, "------------------registered face")

        // temp code for cropping face of reference image
        // We have to register only face image so it is not needed anymore in future
        //const referFaceBuffer = await cropFaceRegion(referenceBuffer)

        const queryFaceBuffer = await cropFaceRegion(queryBuffer)
        if (queryFaceBuffer == "") {
            return 1
        }

        const referFaceImg = new Image();
        referFaceImg.src = referenceBuffer

        const queryFaceImg = new Image();
        queryFaceImg.src = queryFaceBuffer


        //get descriptor of reference face
        //if (!descriptors.reference) {
        descriptors.reference = await faceapi.computeFaceDescriptor(referFaceImg)

        //}

        const queryImg = new Image();
        queryImg.src = queryBuffer
        descriptors.query = await faceapi.computeFaceDescriptor(queryFaceImg)

        const distance = faceapi.utils.round(
            faceapi.euclideanDistance(descriptors.reference, descriptors.query)
        )

        // console.log("similarity is: ", distance.toString())
        return distance

    } catch (error) {
        console.log(error.message)
    }
}

// @desc    Compare two images and check if same person exist or not
const detectAndRecognizeFace = async (referenceBuffer, queryBuffer) => {
    if (referenceBuffer == "") {
        console.log('reference image undefined')
        return "";
    }
    if (queryBuffer == "") {
        console.log('query image undefined')
        return "";
    }


    var queryImg = new Image();
    queryImg.src = queryBuffer;

    if (!netInitialized) {
        await initializeNet();
    }

    //await cropFaceRegion(queryBuffer)

    if (!faceMatcher) {
        faceMatcher = await initializeFaceMatcher(referenceBuffer);
    }

    const queryResult = await faceapi
        .detectSingleFace(queryImg)
        .withFaceLandmarks()
        .withFaceDescriptor()

    if (!queryResult) {
        console.log('no person detected in query image')
        return ""
    }

    if (!faceMatcher) {
        console.log('faceMatcher is not initialized')
        return ""
    }

    const bestMatch = faceMatcher.findBestMatch(queryResult.descriptor)
    console.log(bestMatch.toString())
    return ""
}

