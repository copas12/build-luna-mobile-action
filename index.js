#!/usr/bin/env node
process.env.TZ = 'Asia/Jakarta'
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const axios = require('axios').default;
const moment = require('moment');
const user = 'copas12';
const repo = 'build-luna-mobile-action';
const file = 'data.json';
const url = `https://api.github.com/repos/${user}/${repo}/contents/${file}`;

const getSHA = async () => {
   const response = await axios.get(url);
   const { data } = response;
   return data.sha;
}

const updateGit = async (git_token) => {
   const sha = await getSHA();
   const time = moment().format('YYYY.MM.DD-HH.mm');
   const object = {
      last_updated: time
   }
   const response = await axios.put(
      url,
      {
         "message": `Update ${time}`,
         "content": Buffer.from(JSON.stringify(object)).toString('base64'),
         "sha": sha
      },
      {
         headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${git_token}`
         }
      }
   );
   return response.data;
}

if (argv.token) {
   const token = argv.token;
   updateGit(token)
      .then(console.log)
      .catch((err) => {
         let errorMessage;
         if (err.response) {
            errorMessage = err.response.data;
         } else {
            if (err.message) {
               errorMessage = err.message
            }
         }

         console.log(errorMessage);
      })
} else {
   console.log('Token Required');
}
