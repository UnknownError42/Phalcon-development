<?php

/**
 * @define Document root
 * @define Application path
 * @define Staging development environment
 */
defined('DOCUMENT_ROOT') || define('DOCUMENT_ROOT', $_SERVER["DOCUMENT_ROOT"]);
defined('APP_PATH') || define('APP_PATH', DOCUMENT_ROOT . '/../Application');
defined('APPLICATION_ENV') ||
define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Require composite libraries
require_once DOCUMENT_ROOT . ' /../vendor/autoload.php';

// Require global configurations
require_once DOCUMENT_ROOT . '/../config/application.php';

// Require routes
require_once DOCUMENT_ROOT . '/../config/routes.php';

// Require global services
require_once DOCUMENT_ROOT . '/../config/services.php';

if (APPLICATION_ENV === 'development') {
    ini_set('display_errors', 'On');
    error_reporting(7);
}
else {
    ini_set('display_errors', 'Off');
    error_reporting(0);
}
try {

    $app = new Phalcon\Mvc\Application($di);

    // Require modules
    require_once DOCUMENT_ROOT . '/../config/modules.php';

    // Handle the request
    echo $app->handle()->getContent();

} catch (\Exception $e) {

    if (APPLICATION_ENV === 'development') { // replace by development
        echo $e->getMessage();
    }
    else {
        $response = $di->get('response');
        $response->setContentType('application/json', 'utf-8')
            ->setStatusCode($e->getCode(), $e->getMessage())
            ->setJsonContent(['error' => [
                'code' => $e->getCode(),
                'message' => $e->getMessage()
            ]])->send();
    }
}