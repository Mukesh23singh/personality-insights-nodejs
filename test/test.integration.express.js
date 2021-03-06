/**
 * Copyright 2015-2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
// load default variables for testing
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const request = require('supertest');
const fs = require('fs');

const app = require('../app');
const filePath = path.join(__dirname, '..', '/public/data/text/sample1.txt');
const sampleText = fs.readFileSync(filePath, 'utf-8');

if (!process.env.PERSONALITY_INSIGHTS_IAM_APIKEY) {
  return;
}

describe('integration-express', function() {
  this.timeout(10000);

  it('Generate profile from valid text', () =>
    request(app).post('/api/profile/text')
      .type('form')
      .send({
        language: 'en',
        sourceType: 'text',
        acceptLanguage: 'en',
        rawScores: false,
        consumptionPreferences: true,
        content: sampleText,
        contentType: 'text/plain'
      }).expect(200)
  );

  it('Generate error if insufficient text', () =>
    request(app).post('/api/profile/text')
      .type('form')
      .send({
        language: 'en',
        sourceType: 'text',
        acceptLanguage: 'en',
        rawScores: false,
        contentType: 'text/plain',
        content: sampleText.substring(0, 100)
      }).expect(400)
  );

  it('Generate profile if only text is specified', () =>
    request(app).post('/api/profile/text')
      .type('form')
      .send({
        contentType: 'text/plain',
        content: sampleText
      }).expect(200)
  );

  it('Generate profile from static tweets', () =>
    request(app).post('/api/profile/twitter')
      .type('form')
      .send({
        sourceType: 'twitter',
        acceptLanguage: 'en',
        contentType: 'application/json',
        rawScores: false,
        userId: 'Oprah',
      }).expect(200)
  );

});
