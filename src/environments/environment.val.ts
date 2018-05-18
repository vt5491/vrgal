// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // the url for the rails meta-data service
  //metaDataServiceUrl : "http://192.168.50.158:3000"
  // note: 50.158 is the vmware image running on the game pc
  metaDataServiceUrl : "http://192.168.50.158:1337"
};
