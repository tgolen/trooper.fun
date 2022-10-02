// import iCloud from 'apple-icloud';

// const myICloud = new iCloud('scripts/icloud-session.json', 'tim@golen.net', 'Franzl21l');

// myICloud.on('sessionUpdate', () => {
//     myICloud.saveSession();
// });

// myICloud.on('ready', () => {
//     console.log('ready!');

//     myICloud.Photos.get((err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(data);
//     });
// });

// myICloud.on('err', (err) => {
//     console.error(err);
// });
// import {google} from 'googleapis';
// import Photos from 'googlephotos';

// const auth = new google.auth.GoogleAuth({
//     keyFile: './scripts/trooper-fun-photo-blog-b1f84d0cd297.json',
//     scopes: ['https://www.googleapis.com/auth/cloud-platform', Photos.Scopes.READ_AND_APPEND, Photos.Scopes.SHARING],
// });

// auth.getAccessToken().then((token) => {
//     const photos = new Photos(token);
//     // photos.albums.list().then(console.log);
//     photos.sharedAlbums.list().then(console.log);
// });
const clientID = '750032288883-347sfrobqn1tg8vmv6ij1p49i49eho4c.apps.googleusercontent.com';
const clientSecret = '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';
