# GoogleOAuthDemo

Install nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
Export nvm path
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
Install node with nvm
```
nvm install node 14
```
Install node modules
```
npm install
```

To start the demo, simply run
```
node auth/GoogleAuth.action.js
```
