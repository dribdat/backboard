cd dist
git init .
git add -A
git commit -m 'deploy'
git push -f git@github.com:dribdat/backboard.git main:gh-pages
