name: Chart Notifier

on:
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Compare
        run: node scripts/compare-charts.js
        env:
          ONESIGNAL_APP_ID: ${{ secrets.ONESIGNAL_APP_ID }}
          ONESIGNAL_API_KEY: ${{ secrets.ONESIGNAL_API_KEY }}

      - name: Commit Hashes
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"

          git add hashes.json

          git commit -m "update chart hashes" || echo "No changes"

          git push
