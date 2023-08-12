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
            'Authorization': 'Key ' + process.env.API_KEY
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

/*////////////////////////////////////////*/

const handleImage = (req, res, name, email, id, knex) => {
    clarifai(req.body.input)
        .then(data => {
            knex('users')
                .where({id: id, name: name, email: email})
                .increment('entries', 1)
                .returning('entries')
                .then(entries => {
                    res.json({entries: entries[0].entries, data});
                })
                .catch(err => res.status(400).json('failed to work with database.'));

        })
        .catch(err => res.status(400).json('unable to work properly')); 

}

module.exports = {
    handleImage
}
