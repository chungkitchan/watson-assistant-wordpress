# conversation-wordpress-plugin
A Wordpress plugin for Watson Assistant.

## Development Environment
Before you can work on this plugin, you need to do the following:

1. Install [npm](https://www.npmjs.com/get-npm) and [composer](https://getcomposer.org/doc/00-intro.md).

2. Build the Javascript app by running the following commands from the `js` directory:

```bash
npm install
npm run build
```

In order to build a minimized file, use `npm run prod` instead.

3. Install required PHP libraries by running one of the following commands from the root project directory:

```bash
composer install            # UNIX executable
php composer.phar install   # PHP executable
```

## Testing
There are no unit tests for this plugin at the moment. A Wordpress Docker Compose file has been 
provided for running the plugin on a local instance of Wordpress and manually testing features. 
Simply run the following in your shell from the `docker` directory:

```bash
docker-compose up -d
```

The website can then be accessed at localhost:8000.

## Subsequence Changes

After the first round cloning and changing and testing. The following steps can made subsequence changes to the code and recreate the docker to test:
1.  Change UI code in js directory as needed
2.  Rebuild the UI code by running the following in js directory:
```bash
npm run build
```
3.  Optional install the python library if neccessary in the project root directory:
```bash
composer update            # UNIX executable
```  
4.  Test in docker by following the following in docker directory:
```bash
docker container list
docker container kill xxxxxxxxxxx  # container id get from above command
docker-compose up --force-recreate --build -d
```

## Releasing Updates
You must first have a Wordpress.org account with commit access to the plugin's Wordpress [SVN repository](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/). To release updates to the plugin, you must do the following

1. Build the Javascript `app.js` file by running `npm run prod` as explained above. 
2. Increment the version number in `watson.php` and the `Stable Tag` in `Readme.txt`.
3. Add the new version to the changelog in `Readme.txt`.
4. Copy the contents of the `watson-conversation` directory into the `trunk` or `tags\X.X.X` directory outlined in the [SVN repository documentation](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/).

The plugin description, changelog and FAQ can be changed in the [Readme.txt](https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/) file stored in the `watson-conversation` directory. All relevant Wordpress.org plugin directory documentation, including the above links, can be found [here](https://developer.wordpress.org/plugins/wordpress-org/).

## Releasing Zip for Updates / Installation

The following steps will generate an Watson Assistant Wordpress plugin that can be unzip to the production Wordpress:  
1. cd to the "js" director. 
2. run the following command to build the production app.js & compress the plug in zip format: `npm run dist` . 
3. The Watson Assistant Wordpress plugin zip file will be in the "dist" directory with the timestamp.

## Directories

### docker
This directory contains the files necessary to create a test Wordpress site using docker-compose.

### js
This directory contains the UI component of the plugin: a chat box component implemented using React.js. The commands outlined in `Setup` above are required to compile this React.js project into a single file. The resulting file is located at `watson-conversation/app.js` for the Wordpress server to load.

### watson-conversation
When a user installs this plugin, this is the directory that is placed in the `wp-content/plugins` directory. Once the Javascript app has been built per the instructions above, this directory contains all the files necessary for Wordpress to run the plugin.

### assets
This directory contains the plugin banner and screenshots.
