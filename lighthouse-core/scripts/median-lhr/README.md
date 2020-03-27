## Usage
```sh
  node lighthouse-core/scripts/get-median-lhr.js path/to/lhrs
```

## Using with compare-runs.js

1) Get some data

```sh
node lighthouse-core/scripts/compare-runs.js --name my-collection --collect -n 3 --urls https://www.example.com https://www.nyt.com
```

2) Get median LHR...

...for specific URL
```sh
node lighthouse-core/scripts/get-median-lhr.js timings-data/my-collection/https___www_example_com
```

...for many URLs
```sh
for file in timings-data/my-collection/*; do
  node lighthouse-core/scripts/get-median-lhr.js $file > timings-data/my-collection/`basename $file`-median-lhr.json
done
```

### 11ty Example

```
# download https://github.com/11ty/11ty-website/tree/master/_data/sites
urls=(`jq .url .tmp/sites/*.json -r | grep http`)
node lighthouse-core/scripts/compare-runs.js --name 11ty-collection --collect -n 5 --lh-flags='--only-categories=performance' --urls "${urls[@]}"
```
