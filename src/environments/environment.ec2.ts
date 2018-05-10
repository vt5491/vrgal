// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // the url for the rails meta-data service
  //metaDataServiceUrl : "http://localhost:3000"
  //metaDataServiceUrl : "http://127.0.0.1:3000"
  //metaDataServiceUrl : "http://0.0.0.0:3000" //"blocked loading mixed active content"
  // following works with http
  //metaDataServiceUrl : "http://infinitewheelie.org:3000" 
  //metaDataServiceUrl : "https://0.0.0.0:3000"
  //metaDataServiceUrl : "0.0.0.0:3000" // not a valid url in browser
  //metaDataServiceUrl : "127.0.0.1:3000"
  // remove the 'http' to prevent "block loading mixed content" error against
  // a https server
  //metaDataServiceUrl : "localhost:3000"
  //metaDataServiceUrl : "https://localhost:3000"
  //metaDataServiceUrl : "http://172.31.42.113:3000"
  //metaDataServiceUrl : "https://172.31.42.113:3000"
  //metaDataServiceUrl : "https://infinitewheelie.org:3000"
  //metaDataServiceUrl : "http://0.0.0.0:3002"
  metaDataServiceUrl : "https://infinitewheelie.org/servers/meta-data-proxy"
};
