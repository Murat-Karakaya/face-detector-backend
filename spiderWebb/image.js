const clarifai = (clarifaiImage) => {
    // URL of image to use. Change this to your image.
    const IMAGE_URL = clarifaiImage;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "meat",
        "app_id": "robot-face-detector"
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + '5e505890479a46c5a9c71c5be5ba1e70'
        },
        body: raw
    };
  
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
  
    return fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, requestOptions)
        .then(response => response.json())
        .then(data => {
          return data
        })
        .catch(console.log);

}

const handleApiCall = (req, res) => {
    clarifai(req.body.input)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json("Unable to work with API"))
}





/*////////////////////////////////////////*/

const handleImage = (req, res, id, knex) => {
    //const { id } = req.body;
    knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleApiCall,
    handleImage
}