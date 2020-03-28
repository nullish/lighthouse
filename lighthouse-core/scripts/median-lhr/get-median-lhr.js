/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-disable no-console */

/*
Usage:
  node lighthouse-core/scripts/get-median-lhr.js path/to/lhrs

1) Get some data

node lighthouse-core/scripts/compare-runs.js --name my-collection --collect -n 5 --lh-flags='--only-categories=performance' --urls https://www.example.com https://www.nyt.com

2) Get median LHR...

...for specific URL
node lighthouse-core/scripts/get-median-lhr.js timings-data/my-collection/https___www_example_com

...for many URLs
for file in timings-data/my-collection/*; do
  node lighthouse-core/scripts/get-median-lhr.js $file > timings-data/11ty-collection/`basename $file`-median-lhr.json
done
*/

const fs = require('fs');
const glob = require('glob');
const {getMetrics} = require('../lantern/collect/common.js');
const {getPercentileBy} = require('../lantern/collect/golden.js');

/**
 * Returns LHR w/ the median based on FCP.
 * @param {LH.Result[]} lhrs
 */
function getMedianLhr(lhrs) {
  const resultsWithMetrics = lhrs.map(lhr => {
    const metrics = getMetrics(lhr);
    if (!metrics) throw new Error('could not find metrics'); // This shouldn't happen.
    return {lhr, metrics};
  });
  return getPercentileBy(
    0.5, resultsWithMetrics, ({metrics}) => Number(metrics.firstContentfulPaint)).lhr;
}

const lhrs = [];
const dir = process.argv[2];
const potentialLhrFiles = glob.sync(`${dir}/*.json`);
for (const file of potentialLhrFiles) {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (!json.audits || !json.categories) continue;
  lhrs.push(json);
}

const r = getMedianLhr(lhrs);
console.log(JSON.stringify(r, null, 2));
