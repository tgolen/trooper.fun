import fs from 'fs';
import fetch from 'node-fetch';
import request from 'request';

import {config} from '../src/server/config.js';
console.log(config.googleUserFilePath);

fs.readFile(config.googleUserFilePath, 'utf8', async (err, googleUser) => {
    if (err && err.message.indexOf('no such file or directory') > -1) {
        console.error(`No Google AuthToken found. You need to generate a new one from ${config.urlApp}`);
        return;
    }

    if (err) { console.error(err); return; }

    const user = JSON.parse(googleUser);


    const albumId = config.albumID;
    const userId = user.profile.id;
    const authToken = user.token;

    console.log(`Importing album: ${albumId}`);

    // To list all media in an album, construct a search request
    // where the only parameter is the album ID.
    // Note that no other filters can be set, so this search will
    // also return videos that are otherwise filtered out in libraryApiSearch(..).
    const parameters = {albumId};

    // Submit the search request to the API and wait for the result.
    const data = await libraryApiSearch(authToken, parameters);

    if (data && data.photos && data.photos.length) {
        const photo = data.photos[0];
        request.head(photo.baseUrl, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
        
            request(photo.baseUrl).pipe(fs.createWriteStream(`./data/photos/${photo.filename}`)).on('close', () => {
                console.log('file saved:', photo.filename);
            });
        });
    }


    // console.log('Loading albums from API.');

    // // Retrieve the albums from the Library API and list them
    // const data = await libraryApiGetAlbums(user.token);
    // if (data.error) {
    //     // Error occured during the request. Albums could not be loaded.
    //     console.error(data);
    //     return;
    // }

    // if (!data.albums || !data.albums.length) {
    //     console.log('No albums found');
    //     return;
    // }
    
    // data.albums.forEach((album) => {
    //     console.log(`Found album: ${album.title} ${album.id}`);
    // });
});


// Submits a search request to the Google Photos Library API for the given
// parameters. The authToken is used to authenticate requests for the API.
// The minimum number of expected results is configured in config.photosToLoad.
// This function makes multiple calls to the API to load at least as many photos
// as requested. This may result in more items being listed in the response than
// originally requested.
async function libraryApiSearch(authToken, parameters) {
    let photos = [];
    let nextPageToken = null;
    let error = null;
  
    parameters.pageSize = 100;
  
    try {
      // Loop while the number of photos threshold has not been met yet
      // and while there is a nextPageToken to load more items.
      do {
        console.log(`Submitting search with parameters: ${JSON.stringify(parameters)}`);
  
        // Make a POST request to search the library or album
        const searchResponse =
          await fetch(config.apiEndpoint + '/v1/mediaItems:search', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(parameters)
          });
  
        const result = await checkStatus(searchResponse);
  
        // console.log(`Response: ${result}`);
  
        // The list of media items returned may be sparse and contain missing
        // elements. Remove all invalid elements.
        // Also remove all elements that are not images by checking its mime type.
        // Media type filters can't be applied if an album is loaded, so an extra
        // filter step is required here to ensure that only images are returned.
        const items = result && result.mediaItems ?
            result.mediaItems
                .filter(x => x)  // Filter empty or invalid items.
                // Only keep media items with an image mime type.
                .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
            [];
  
        photos = photos.concat(items);
  
        // Set the pageToken for the next request.
        parameters.pageToken = result.nextPageToken;
  
        console.log(
            `Found ${items.length} images in this request. Total images: ${
                photos.length}`);
  
        // Loop until the required number of photos has been loaded or until there
        // are no more photos, ie. there is no pageToken.
      } while (photos.length < 1000 &&
               parameters.pageToken != null);
  
    } catch (err) {
      // Log the error and prepare to return it.
      error = err;
      console.error(error);
    }
  
    console.log('Search complete.');
    return {photos, parameters, error};
  }


// Returns a list of all albums owner by the logged in user from the Library
// API.
async function libraryApiGetAlbums(authToken) {
    let albums = [];
    let nextPageToken = null;
    let error = null;
  
    let parameters = new URLSearchParams();
    parameters.append('pageSize', 50);
  
    try {
        // Loop while there is a nextpageToken property in the response until all
        // albums have been listed.
        do {
            console.log(`Loading albums. Received so far: ${albums.length}`);
            // Make a GET request to load the albums with optional parameters (the
            // pageToken if set).
            const albumResponse = await fetch(config.apiEndpoint + '/v1/albums?' + parameters, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
            });
    
            const result = await checkStatus(albumResponse);
    
            console.log(`Response: ${result}`);
    
            if (result && result.albums) {
                console.log(`Number of albums received: ${result.albums.length}`);
                // Parse albums and add them to the list, skipping empty entries.
                const items = result.albums.filter(x => !!x);
        
                albums = albums.concat(items);
            }
        if (result.nextPageToken) {
                parameters.set('pageToken', result.nextPageToken);
        } else {
                parameters.delete('pageToken');
        }
        
        // Loop until all albums have been listed and no new nextPageToken is
        // returned.
      } while (parameters.has('pageToken'));
  
    } catch (err) {
        // Log the error and prepare to return it.
        error = err;
        console.error(error);
    }
  
    console.log('Albums loaded.');
    return {albums, error};
  }

// Return the body as JSON if the request was successful, or thrown a StatusError.
async function checkStatus(response){
    if (!response.ok){
        // Throw a StatusError if a non-OK HTTP status was returned.
        let message = "";
        try{
            // Try to parse the response body as JSON, in case the server returned a useful response.
            message = await response.json();
        } catch( err ){
            // Ignore if no JSON payload was retrieved and use the status text instead.
        }
        if (response.status === 401) {
            throw new Error('auth token expired');
        }
        throw new Error('cannot parse response', response);
    }

    // If the HTTP status is OK, return the body as JSON.
    return await response.json();
}
